from flask import Flask, request
from app import app
from app.models import Session, Plate, Well
from app.config import Config
from app.helpers import checks_reqs, check_optionals, validate_reagent, \
                        validate_antibody, validate_concentration
from sqlalchemy import update, select
from uuid import uuid4
import time


app.teardown_request(lambda ctx: Session.remove())

@app.post('/plate')
def create_plate():

    required_fields = {"n_wells": int}

    data = request.json

    if not checks_reqs(data, required_fields):
        return {
            "message": f"Not all required fields were provided: {required_fields}"
        }, 400

    if not any(map(lambda x: data["n_wells"]==x, Config.PLATE_SIZES.values())):
        return {
            "message": f"Invalid plate size provided. Valid values: {list(Config.PLATE_SIZES.values())}"
        }, 400

    plate_id = str(uuid4())
    description = data["description"] \
        if "description" in data \
        else f"New Plate -- {time.asctime(time.gmtime())}"

    new_plate = Plate(
        plate_id=plate_id,
        n_wells=data["n_wells"],
        description=description
    )

    with Session() as session:
        session.add(new_plate)
        session.commit()

    return {"plate_id": plate_id}, 201

@app.put('/plate/<string:plate_id>/well/<int:well_id>')
def edit_well(plate_id: str, well_id: int):

    data = request.json

    optional_fields = {
        "anitobdy": str,
        "reagent": str,
    }

    if not check_optionals(data, optional_fields):
        return {
            "message": f"At least one optional field was incorrectly" +
                       f" provided: {optional_fields}"
        }, 400


    if not validate_antibody(data.get("antibody")):
        return {
            "message": "Invalid antibody provided."
        }, 400

    if not validate_reagent(data.get("reagent")):
        return {
            "message": "Invalid reagent provided."
        }, 400

    if not validate_concentration(data):
        return {
            "message": "Invalid concentration provided."
        }, 400


    with Session() as session:
        plate = session.get(Plate, plate_id)

    if not plate or plate.deleted:
        return {
            "message": f"Plate {plate_id} does not exist."
        }, 404

    if well_id < 1 or well_id > plate.n_wells:
        return {
            "message": f"Invalid well_id: {well_id}.\n0 < well_id < {plate.n_wells}"
        }, 400

    with Session() as session:
        well = session.get(
            Well,
            {"plate_id": plate_id, "well_id": well_id}
        )

        if well:
            well.reagent=data.get("reagent")
            well.antibody=data.get("antibody")
            well.concentration=data.get("concentration")

            new = False
        else:
            new_well = Well(
                well_id=well_id,
                plate=plate,
                reagent=data.get("reagent"),
                antibody=data.get("antibody"),
                concentration=data.get("concentration"),
            )
            session.add(new_well)
            new = True

        session.commit()

    return {}, 201 if new else 200

@app.get('/plate/<string:plate_id>/well/<int:well_id>')
def get_well(plate_id: str, well_id: int):

    with Session() as session:
        plate = session.get(Plate, plate_id)
        well = session.get(
            Well,
            {"plate_id": plate_id, "well_id": well_id}
        )

    if not plate or plate.deleted:
        return {
            "message": f"Plate {plate_id} does not exist."
        }, 404

    if not well:
        return {
            "message": "Well does not exist or is unfilled."
        }, 200

    return {
        "plate_id": plate_id,
        "well_id": well_id,
        "reagent": well.reagent,
        "antibody": well.antibody,
        "concentration": well.concentration,
    }, 200

@app.delete('/plate/<string:plate_id>')
def delete_plate(plate_id: str):

    with Session() as session:
        plate = session.get(Plate, plate_id)

    if not plate or plate.deleted:
        return {
            "message": f"Plate {plate_id} does not exist."
        }, 404

    with Session() as session:
        stmt = (
            update(Plate)
            .where(Plate.plate_id == plate_id)
            .values(deleted=True)
        )
        session.execute(stmt)
        session.commit()

    return {}, 200

@app.get('/plate/<string:plate_id>')
def get_plate(plate_id: str):

    with Session() as session:
        plate = session.get(Plate, plate_id)

    if not plate or plate.deleted:
        return {
            "message": f"Plate {plate_id} does not exist."
        }, 404

    with Session() as session:
        stmt = (
            select(Well)
            .where(Well.plate_id == plate.plate_id)
        )
        wells = session.execute(stmt).all()

    return {
        **plate.json(),
        "wells": [w[0].json() for w in wells]
    }, 200

@app.get('/plates')
def get_plates(page: int=1):

    with Session() as session:
        stmt = (
            select(Plate)
            .where(Plate.deleted == False)
            .limit(Config.PLATE_PAGE_SIZE)
            .offset((page-1) * Config.PLATE_PAGE_SIZE)
        )
        plates = session.execute(stmt).all()

    print(f"test plates: {plates}")

    return {
        "plates": [p[0].json() for p in plates]
    }, 200
