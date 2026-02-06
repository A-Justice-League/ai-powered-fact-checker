"""
Utility functions for credibility scoring.
"""


def calculate_credibility_score(claims: list) -> float:
    """
    Calculate credibility score based on claim verdicts.
    
    Args:
        claims: List of claim dictionaries with 'verdict' keys
        
    Returns:
        Float score between 0-100
        
    Formula:
        score = ((true_count + unsure_count * 0.5) / total_claims) * 100
        
    Example:
        >>> claims = [{'verdict': 'TRUE'}, {'verdict': 'FALSE'}, {'verdict': 'UNSURE'}]
        >>> calculate_credibility_score(claims)
        50.0
    """
    if not claims:
        return 0.0
    
    true_count = sum(1 for c in claims if c.get("verdict") == "TRUE")
    unsure_count = sum(1 for c in claims if c.get("verdict") == "UNSURE")
    total_claims = len(claims)
    
    score = ((true_count + (unsure_count * 0.5)) / total_claims) * 100
    return round(score, 1)
