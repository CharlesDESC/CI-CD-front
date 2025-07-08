# CI-CD-front

## Description

Ce dépôt contient la configuration pour le front-end de notre projet, utilisant Docker pour la conteneurisation et Cypress pour les tests end-to-end.

## Prérequis

- [Docker](https://www.docker.com/get-started) doit être installé pour exécuter les conteneurs.
- [Node.js](https://nodejs.org/) doit être installé pour exécuter les scripts npm.

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/CharlesDESC/CI-CD-front
   ```

2. Accédez au dossier `CI-CD-front` :
   ```bash
   cd CI-CD-front
   ```

## Lancer les Architectures Docker

1. Assurez-vous d'être dans le répertoire contenant le fichier `docker-compose.yml` :
   ```bash
   cd CI-CD-front
   ```

2. Lancez les conteneurs Docker :
   ```bash
   docker-compose up
   ```

3. Pour arrêter les conteneurs :
   ```bash
   docker-compose down
   ```

## Exécuter les Tests

1. Assurez-vous que les conteneurs Docker sont en cours d'exécution.
2. Accédez au répertoire des tests :
   ```bash
   cd frontend/cypress
   ```

3. Exécutez les tests Cypress :
   ```bash
   npx cypress open
   ```

## Auteurs

- Théo Catala
- Charles Deschamps

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.