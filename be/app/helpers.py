from app.config import Config

checks_reqs = lambda data, reqs: all(
    map(lambda x: type(data.get(x)) == reqs[x], reqs)
)

def _check_optional(data: dict, req: str, req_type: type) -> bool:
    if not data.get(req):
        return True
    else:
        return type(data[req]) == req_type

check_optionals = lambda data, reqs: all(
    map(lambda x: _check_optional(data, x, reqs[x]), reqs)
)

def validate_reagent(reagent: str) -> bool:
    if not reagent:
        return True
    else:
        return (reagent[0] == "R") and (reagent[1:].isdigit())

def validate_antibody(antibody: str) -> bool:
    if not antibody:
        return True

    n_acids = len(antibody)

    if n_acids < Config.MIN_ANTIBODY or n_acids > Config.MAX_ANTIBODY:
        return False

    if not all(map(lambda x: x in Config.AMINO_ACIDS, antibody)):
        return False

    return True

def validate_concentration(data: dict) -> bool:
    if data.get("antibody"):
        if data.get("concentration"):
            try:
                data["concentration"] = float(data.get("concentration"))
                return True
            except Exception:
                return False
        else:
            return True
    else:
        return not bool(data.get("concentration"))
