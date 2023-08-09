import logging
from typing import List, Optional
import enum
from sqlalchemy import create_engine, ForeignKey, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, \
                           relationship, sessionmaker, scoped_session
import sqlalchemy.sql.functions as F
from app.config import Config
from datetime import datetime

class Base(DeclarativeBase):
    pass


class Plate(Base):
    __tablename__ = "plates"

    plate_id: Mapped[str] = mapped_column(String(36),primary_key=True)
    description: Mapped[str] = mapped_column(nullable=True)
    n_wells: Mapped[int] = mapped_column(nullable=False)
    deleted: Mapped[bool] = mapped_column(default=False)
    created_dt: Mapped[datetime] = mapped_column(server_default=F.now())

    wells: Mapped[List["Well"]] = relationship(
        back_populates="plate", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"Plate(plate_id={self.id}, n_wells={self.n_wells})"

class Well(Base):
    __tablename__ = "wells"

    well_id: Mapped[int] = mapped_column(primary_key=True)

    reagent: Mapped[str] = mapped_column(nullable=True)
    antibody: Mapped[str] = mapped_column(nullable=True)
    concentration: Mapped[float] = mapped_column(nullable=True)

    plate_id: Mapped[int] = mapped_column(
        ForeignKey("plates.plate_id"),
        primary_key=True
    )
    plate: Mapped["Plate"] = relationship(back_populates="wells")

    def __repr__(self) -> str:
        return f"Well(well_id={self.well_id}, plate_id={self.plate_id})"

engine = create_engine(Config.SQLALCHEMY_DATABASE_URI, echo=True)
Session = scoped_session(sessionmaker(engine))

Base.metadata.create_all(engine)

