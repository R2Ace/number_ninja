import random 

#this is a game that prompts the user to guess the correct numbers as i generate random ones

top_range = input("Type a number: ")

if top_range.isdigit():
    top_range = int(top_range)

random_number = random.randrange(-5, 11)

