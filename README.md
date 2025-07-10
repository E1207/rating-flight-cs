# rating-flight-cs Frontend : Dev Installation

Ce projet est une application de gestion des évaluations de vols, permettant aux utilisateurs de noter leurs expériences de vol et aux compagnies aériennes de répondre à ces évaluations.

## I- Installation et Configuration

### 1. Prérequis
- Node.js 18 et plus (recommandé : version LTS)
- npm 9 et plus
- Angular CLI 17+
- IDE (Visual Studio Code recommandé)
- Git

### 2. Installation

1. Cloner le repository :
```bash
git clone https://github.com/E1207/rating-flight-cs.git
```
2. Import dans Visual Studio Code :
- Ouvrir Visual Studio Code
- Choisir "Open Folder" et sélectionner le répertoire cloné
- VS Code détecte automatiquement le projet Angular

3. Installation des dépendances :
- Ouvrir le terminal intégré 
- Exécuter la commande : npm install

# Démarrage en mode développement
ng serve

### II- Architecture

src/
├── app/
│   ├── components/         
│   │   ├── home/           
│   │   ├── rating-flight/  
│   │   ├── rating-list/    
│   │   ├── rate-detail/    
│   │   └── admin/         
│   ├── services/         
│   ├── models/           
│   ├── guards/           
│   └── utils/           
├── environments/        
└── assets/           

### 2. Aspects Techniques

Pour ce qui est un peu plus technique côté angular nous avons utilisé :
- Les composants en standalone , pour ne plus avoir à utiliser le ngModule, et avoir des composants plus autonomes
- Les siganux, pour gérer les états ,  la performance de notre application
- Le Guard Angular pour gérer les routes sécurisé et les rôles
- La gestion des erreurs CORS depuis le backend, en acceptant les appels REST qui proviennent de notre Front
- La gestion des Erreurs 


## V- Utilisation de l'IA

L'utilisation de L'IA pour la partie Frontend a été faite : 
- Au niveau de style et de la Forme : principalement à ce niveau que j'ai utilisé l'IA, pour avoir un beau rendu visuel, respecter les normes d'accessibilité.
- Pour m'expliquer comment je pouvais résoudre certains problèmes rencontrés ( notamment sur comment resoudre l'erreur CORS)
- Pour faire du parsing de date un peu complexe
- Pour gerer le model, simulaire au objet de back 

