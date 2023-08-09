import os


basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    PLATE_SIZES = dict(
        SMALL_PLATE_N_WELLS=96,
        LARGE_PLATE_N_WELLS=384,
    )

    AMINO_ACIDS = {
        "A", "R", "N", "D", "C", "E", "Q", "G", "H", "I", "L", "K", "M", "F",
        "P", "S", "T", "W", "Y", "V", "U", "O",
    }

    MIN_ANTIBODY = 20
    MAX_ANTIBODY = 40
