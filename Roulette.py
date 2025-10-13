from random import randint

def miser(jetons_restants):
    numero = choisir_nombre()
    mise = miser_jetons(jetons_restants)
    return numero, mise

def choisir_nombre():
    nombre = -1
    while not (0 <= nombre <= 49):
        try:
            nombre = int(input("Choisissez un nombre entre 0 et 49 : "))
            if not (0 <= nombre <= 49):
                print("Erreur : le nombre doit être compris entre 0 et 49")
        except ValueError:
            print("Veuillez entrer un nombre valide.")
            nombre = -1
    return nombre

def miser_jetons(jetons_restants):
    while True:
        try:
            mise = int(input(f"Combien de jetons voulez-vous miser (il vous reste {jetons_restants}) ? "))
            if mise > jetons_restants:
                print("Vous ne pouvez pas miser plus de jetons que vous n'en avez.")
            elif mise <= 0:
                print("Vous devez miser au moins un jeton.")
            else:
                return mise
        except ValueError:
            print("Veuillez entrer un nombre valide.")

def tourner_la_roulette():
    numero = randint(0,49)
    print(f"Le croupier tourne la roulette. Le numéro {numero} est le numéro gagnant !")
    return numero

def calculer_gains_couleur(mise):
    return int(mise * 0.5)

def calculer_gains_numero(mise):
    return mise * 3

def continuer_de_jouer(jetons_restants):
    if jetons_restants <= 0:
        print("Vous êtes ruiné.e. C’est la fin de la partie.")
        return False
    else:
        print(f"Il vous reste {jetons_restants} jetons.")
        rejouer = input("Souhaitez-vous continuer ? (o/n) ")
        if rejouer.lower() == "o":
            return True
        else:
            print(f"Vous quittez le jeu avec {jetons_restants} jetons. À bientôt !")
            return False

jetons = 100
continuer = True

while continuer:
    gains = 0
    numero_mise, mise = miser(jetons)
    numero_gagnant = tourner_la_roulette()
    if numero_gagnant == numero_mise:
        gains = calculer_gains_numero(mise)
        print(f"Bon numéro ! Gains = {gains}")
    elif numero_gagnant % 2 == numero_mise % 2:
        gains = calculer_gains_couleur(mise)
        print(f"Bonne couleur ! Gains = {gains}")
    else:
        gains = -mise
        print(f"Dommage ! Gains = {gains}")
    jetons += gains
    continuer = continuer_de_jouer(jetons)