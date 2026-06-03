def calculate_fair_market_price(followers, engagement_rate, platform, category):
    """
    Calculate the deterministic fair market price for a sponsored post.
    Based on standard industry benchmarks ($10-$20 per 1000 engagements depending on niche).
    """
    try:
        followers = float(followers.replace(',', '')) if isinstance(followers, str) else float(followers)
    except:
        followers = 0
        
    try:
        if isinstance(engagement_rate, str):
            engagement_rate = float(engagement_rate.replace('%', ''))
        else:
            engagement_rate = float(engagement_rate)
    except:
        engagement_rate = 0.0

    engagements = followers * (engagement_rate / 100.0)
    
    # Base CPM for Engagements (Cost Per 1000 Engagements)
    # E.g. $15 per 1000 engagements
    base_cpe = 15.0
    
    # Platform modifiers
    platform = platform.lower()
    if platform == 'youtube':
        base_cpe *= 1.8  # YouTube integrations are much more expensive and long-lasting
    elif platform == 'instagram':
        base_cpe *= 1.2
    elif platform == 'tiktok':
        base_cpe *= 0.8
        
    # Category modifiers
    category = category.lower()
    if 'finance' in category or 'crypto' in category or 'tech' in category:
        base_cpe *= 1.5
    elif 'beauty' in category or 'fashion' in category:
        base_cpe *= 1.2
    
    # Calculate price
    raw_price = (engagements / 1000.0) * base_cpe
    
    # Minimum price floor
    if raw_price < 50:
        raw_price = 50
        
    # Round to nearest 50
    final_price = round(raw_price / 50) * 50
    return int(final_price)
