import json
import os

def find_duplicates(files):
    # Dictionary to store values and their counts
    values_count = {}
    # List to store duplicate values
    duplicates = []

    # Iterate through each file
    for file_path in files:
        # Check if file exists
        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                data = json.load(file)
                # Iterate through each value in the JSON file
                for value in data.values():
                    # If value is already in the dictionary, increment its count
                    if value in values_count:
                        values_count[value] += 1
                        # If count becomes 2, it's a duplicate
                        if values_count[value] == 2:
                            duplicates.append(value)
                    else:
                        values_count[value] = 1
        else:
            print(f"File not found: {file_path}")

    return duplicates

def update_common_json(duplicates):
    common_json = 'common.json'
    # Check if common.json exists, if not create it
    if not os.path.exists(common_json):
        with open(common_json, 'w') as file:
            json.dump([], file)

    with open(common_json, 'r') as file:
        common_data = json.load(file)
        # Add new duplicate values to common.json if they are not already present
        for duplicate in duplicates:
            if duplicate not in common_data:
                common_data.append(duplicate)

    with open(common_json, 'w') as file:
        json.dump(common_data, file, indent=4)

def main():
    # List of JSON files
    json_files = ['file1.json', 'file2.json', 'file3.json']  # Add your file paths here

    # Find duplicate values across JSON files
    duplicates = find_duplicates(json_files)

    # Update common.json with new duplicate values
    update_common_json(duplicates)

if __name__ == "__main__":
    main()
