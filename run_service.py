#!/usr/bin/env python3
"""Start backend services from project root"""

import sys
import os

# Add project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    import uvicorn
    service = sys.argv[1] if len(sys.argv) > 1 else "identity"
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8001
    
    app_map = {
        "identity": "backend.identity_service.main:app",
        "salary": "backend.salary_service.main:app",
        "search": "backend.search_service.main:app",
        "stats": "backend.stats_service.main:app",
        "vote": "backend.vote_service.main:app",
    }
    
    app = app_map.get(service, app_map["identity"])
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        reload=True
    )
