import random 

#this is a game that prompts the user to guess the correct numbers as i generate random ones

print("What it do? Welcome to my basic game.")

top_range = input("Please enter a number: ")

#Make sure the answer we get is a digit and then convert it to an interger
if top_range.isdigit():
    top_range = int(top_range)

    #Making sure user enter a number greater than 0
    if top_range <= 0:
        print("Oopsies, Enter a number larger than 0 to proceed")
        quit()
else:
    print("Oops, it's okay. Enter a number to proceed")


#We generate random numbers based on the input range the user provided
random_number = random.randrange(top_range)
print(random_number)

