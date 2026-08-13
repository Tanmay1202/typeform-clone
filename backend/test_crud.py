import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.crud import create_form
from app.schemas import FormCreate

db = SessionLocal()
try:
    form = FormCreate(title="Test", workspace_id=1)
    create_form(db, form)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
