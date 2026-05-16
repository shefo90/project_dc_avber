import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.core.database import engine, Base
from app.models import department, employee, project  # noqa: F401


def main():
    Base.metadata.create_all(bind=engine)
    print("All tables created successfully.")


if __name__ == "__main__":
    main()
