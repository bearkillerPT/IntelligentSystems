from openpyxl import load_workbook

f = open("database_v2.pl","w+")
workbook = load_workbook(r"dataset_v3.xlsx")

def to_write(sheet, text):
    for row in sheet.rows:
        s = '"'
        for cell in row:
            if cell.value != None:
                s = s +  str(cell.value) + '", "'
        if s != '"':
            f.write(text + s[:-3] + ').\n')

for sheet in workbook:
    if sheet.title == 'Flights':
        f.write("\n% Flights\n")
        to_write(sheet, 'flight(')
        print("Flights done...\n\n")
    
    elif sheet.title == 'Seasons':
        f.write("\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n\n% Seasons\n")
        to_write(sheet, 'season(')
        print("Seasons done...\n\n")
    
    elif sheet.title == 'Accomodations':
        f.write("\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n\n% Accomodations\n")
        to_write(sheet, 'accomodation(')
        print("Accomodations done...\n\n")

    elif sheet.title == 'Attractions':
        f.write("\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n\n% Attractions\n")
        to_write(sheet, 'attraction(')
        print("Attractions done...\n\n")

    elif sheet.title == 'AttractionsTypes':
        f.write("\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n\n% Attractions types\n")
        to_write(sheet, 'attraction_type(')
        print("Attractions types done...\n")

f.close()
