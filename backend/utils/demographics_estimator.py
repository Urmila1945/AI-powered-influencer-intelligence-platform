def estimate_demographics(category, platform):
    # Base demographic distributions by category
    distributions = {
        "Tech": {"Male": 75, "Female": 25, "18-24": 35, "25-34": 45, "35+": 20},
        "Gaming": {"Male": 85, "Female": 15, "18-24": 55, "25-34": 30, "35+": 15},
        "Beauty": {"Male": 10, "Female": 90, "18-24": 45, "25-34": 40, "35+": 15},
        "Fashion": {"Male": 20, "Female": 80, "18-24": 40, "25-34": 45, "35+": 15},
        "Fitness": {"Male": 55, "Female": 45, "18-24": 30, "25-34": 50, "35+": 20},
        "Finance": {"Male": 70, "Female": 30, "18-24": 20, "25-34": 55, "35+": 25},
        "Entertainment": {"Male": 50, "Female": 50, "18-24": 45, "25-34": 35, "35+": 20},
        "Vlogs": {"Male": 45, "Female": 55, "18-24": 40, "25-34": 40, "35+": 20},
        "Education": {"Male": 55, "Female": 45, "18-24": 40, "25-34": 35, "35+": 25},
        "Lifestyle": {"Male": 30, "Female": 70, "18-24": 35, "25-34": 45, "35+": 20},
        "General": {"Male": 50, "Female": 50, "18-24": 35, "25-34": 40, "35+": 25}
    }
    
    dist = distributions.get(category, distributions["General"])
    
    # Slight shift for platform (Instagram skews slightly more female/younger than YouTube on average)
    if platform == "Instagram":
        dist = {
            "Male": max(dist["Male"] - 5, 0),
            "Female": min(dist["Female"] + 5, 100),
            "18-24": min(dist["18-24"] + 5, 100),
            "25-34": dist["25-34"],
            "35+": max(dist["35+"] - 5, 0)
        }
        
    return dist
