import random 

#this is a game that prompts the user to guess the correct numbers as i generate random ones

print("What it do? Welcome to my basic guessing game.")

while True:
    user_guess = input("Please enter a number: ")

    #Make sure the answer we get is a digit and then convert it to an interger
    if user_guess.isdigit():
        user_guess = int(user_guess)

        #Making sure user enter a number greater than 0
        if user_guess <= 0:
            print("Oopsies, Enter a number larger than 0 to proceed")
            quit()
        else:
            break
    else:
        print("Oops, it's okay. Enter a number to proceed")
        continue


#We generate random numbers based on the input range the user provided
random_number = random.randint(1, user_guess)
print("I have generated a random_number between 1 and", user_guess)

attempts = 0
max_attempts = 5

#We prompt the user to make multiple guesses
while attempts < max_attempts:
    user_guess = input("Make another guess: ")
    if user_guess.isdigit():
        user_guess = int(user_guess)
    else:
        print("Oops, it's okay. Enter a number to proceed")
        continue

    attempts += 1 
    
    #check if the user's attempt is low or high
    if user_guess < random_number:
        print("Oops, your guess is too low")
    elif user_guess > random_number:
        print("Oops, your guess is too high")
    elif user_guess == random_number:
        print("Letsssss go, You have guessed the correct number")
        break

if attempts == max_attempts:
    print("Oops, you have reached the maximum number of attempts. The correct number was", random_number)

play_again = input("Would you like to play again? (yes/no): ").lower()
if play_again != "yes":
    print("Thank you for playing my game. Goodbye!, signed: Rob The Creator")
    quit()
 