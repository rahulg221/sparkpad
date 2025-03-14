from services.calendar_service import create_google_event, extract_datetime, get_calendar_service

test_strings = [
        "Submit wabtec housing app by March 18th at 5pm",
    ]
    
for test in test_strings:
    result = extract_datetime(test)
    if result:
        print(f"'{test}' {result}")
        res = create_google_event(test)
        print(res)
    else:
        print(f"Could not extract datetime from '{test}'")

