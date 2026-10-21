import sys
import os

# Backend डिरेक्टरीचा पाथ ॲड करा जेणेकरून imports सापडतील
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.main import app
