import random 

#this is a game that prompts the user to guess the correct numbers as i generate random ones

print("What it do? Welcome to my basic game.")

user_guess = input("Please enter a number: ")

#Make sure the answer we get is a digit and then convert it to an interger
if user_guess.isdigit():
    user_guess = int(user_guess)

    #Making sure user enter a number greater than 0
    if user_guess <= 0:
        print("Oopsies, Enter a number larger than 0 to proceed")
        quit()
else:
    print("Oops, it's okay. Enter a number to proceed")


#We generate random numbers based on the input range the user provided
random_number = random.randrange(user_guess)
print(random_number)


#We prompt the user to make another guess
while True:
    user_guess = input("Make another guess: ")
    if user_guess.isdigit():
        user_guess = int(user_guess)
    else:
        print("Oops, it's okay. Enter a number to proceed")
        continue
 