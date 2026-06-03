import os
import re

files_to_update = [
    "backend/app.py",
    "backend/config.py",
    "backend/ml/influencer_score_model.py",
    "backend/models/analytics.py",
    "backend/models/influencer_model.py",
    "backend/reports/pdf_generator.py",
    "backend/routes/bonus_routes.py",
    "backend/routes/influencer_routes.py",
    "backend/routes/report_routes.py",
    "backend/routes/score_routes.py",
    "backend/routes/scoring_routes.py",
    "backend/services/instagram_service.py",
    "backend/services/llm_service.py",
    "backend/services/youtube_service.py",
    "backend/test_api.py",
    "backend/test_apis.py",
    "backend/utils/score_calculator.py",
    "docker-compose.yml",
    "frontend/src/layouts/MainLayout.jsx",
    "frontend/src/pages/AuthPage.jsx",
    "frontend/src/pages/Dashboard.jsx",
    "frontend/src/pages/InfluencerAnalysis.jsx",
    "frontend/src/pages/LandingPage.jsx",
    "frontend/src/pages/placeholders.jsx",
    "frontend/src/services/api.js"
]

for filepath in files_to_update:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Simple replacements
        new_content = content.replace('Ratefluencer', 'ViralMind')
        new_content = new_content.replace('ratefluencer', 'viralmind')
        new_content = new_content.replace('RATEFLUENCER', 'VIRALMIND')
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Failed {filepath}: {e}")
