# Rattrapages 2025 : Testons notre nouvelle feature de suppression d'un webinaire !

## Table des matières

- [Rattrapages 2025 : Testons notre nouvelle feature de suppression d'un webinaire !](#testons-notre-nouvelle-feature-de-suppresion-d-un-webinaire-)
  - [Table des matières](#table-des-matieres)
  - [Présentation du contexte](#présentation-du-contexte)
  - [Notation](#notation)
  - [Aide à la réalisation de ce TP](#aide-à-la-réalisation-de-ce-tp)
  - [Spécifications](#spécifications)
  - [How to use ?](#how-to-use-)
  - [Marche à suivre](#marche-à-suivre)
    - [Création de tests unitaires](#création-de-tests-unitaires)
      - [Préparation du test unitaire](#préparation-du-test-unitaire)
      - [Développement du use-case](#développement-du-use-case)
    - [Création de tests d'intégrations](#création-de-tests-dintégrations)
      - [Développement du repository Prisma](#développement-du-repository-prisma)
      - [Écriture du test d'intégration](#écriture-du-test-dintégration)
    - [Création du test E2E](#création-du-test-e2e)
      - [Développement d'une nouvelle route](#développement-dune-nouvelle-route)
      - [Écriture du test E2E](#écriture-du-test-e2e)

## Présentation du contexte

Vous développez une application de gestion de webinaires en suivant les concepts de l'architecture Ports / Adapters.

Un `use-case` est déjà implémenté : organiser un webinaire (`organize-webinar`), qui pourrait servir de modèle.

Dans les précédents TP, vous avez déjà réalisé des développements pour découvrir l'architecture et la mise en place de tests.

Les notions, que nous avons déjà vu en cours et en TP, ne seront pas ré-expliquées dans ce README.

Cette fois-ci, nous allons implémenter :

- le développement d'un nouveau `use-case`, `cancel-webinar.ts` et les tests unitaires associés
- l'ajout d'un nouvel `adapter`, `webinar-repository.prisma.ts` et les tests d'intégration associés
- une nouvelle route dans le router et un test e2e `api.e2e.test.ts` sur cette nouvelle route.

## Notation

Vous serez évalué sur :

- la qualité de votre architecture et le respect des principes Port & Adapters
- la complétion du TP
- l'exhaustivité de vos tests pour couvrir les cas importants
- l'usage de fixtures pour rendre vos tests expressifs

## Aide à la réalisation de ce TP

Bien évidemment, vous avez le droit de vous servir d'internet, de l'IA, **de vos TPs** et de vos cours pour réaliser celui-ci.

> ⚠️ Un usage non maîtrisé de l'IA se voit très rapidement dans le rendu, il faut comprendre et s'approprier ses suggestions pour produire de la qualité.

## Spécifications

Pour cette fonctionnalité `cancel-webinar`, voici quelques règles métier que le doit retrouver dans votre `use-case`:

- seul l'organisateur peut supprimer un webinaire
- on ne peut pas supprimer un webinaire qui n'existe pas
- dans ces deux "wrong path", une erreur doit être levée
- L'organisateur du webinaire doit être averti par mail (ex: `The webinar "${webinar.props.title}" has been canceled`)

## How to use ?

- `npm run test:watch` pour lancer vos tests unitaires en watch mode
- `npm run test:int` pour lancer les tests d'intégrations / e2e (`test:int:watch` en mode watch)

## Marche à suivre

### Création de tests unitaires

#### Préparation du test unitaire

> 💡 Inspirez-vous du TU existant pour l'organisation d'un webinaire.

```typescript
describe('Feature : Cancel webinar', () => {
  // Initialisation de nos tests, boilerplates...
  describe('Scenario: Happy path', () => {
    // Code commun à notre scénario : payload...
    it('should change the number of seats for a webinar', async () => {
      // Vérification de la règle métier, condition testée...
    });
  });

  describe('Scenario (wrong path): User is not organizer', () => {
    it('should throw an error and not cancel webinar when xxx', async () => {});
  });
});
```

> 💡 [Rejects](https://jestjs.io/docs/expect#rejects) vous aidera à tester les erreurs lancées par votre use-case.

#### Développement du use-case

> 💡 Inspirez-vous du modèle et de vos TPs pour couvrir les spécifications de ce use-case.

Pour l'envoi de mail, nous utiliserons le mailer in-memory qui est déjà implémenté dans la code-base. Il suffira de l'injecter en dépendances de votre use-case.

Dans le test unitaire, on cherchera à valider que le mail est bien présent dans le mailer.

Pour la récupération d'un utilisateur, vous remarquerez que le port `user-repository` est déjà déclaré, mais pas l'adapter in-memory. Ce sera donc à vous de l'implémenter et de l'injecter dans ce use-case.

### Création de tests d'intégrations

#### Développement du repository Prisma

Jusqu'à présent, nous avons travaillé avec un **repository in-memory**, très utile pour débuter dans la création de nos use-cases et dans nos tests unitaires.

Mais ça n'aurait pas vraiment de sens de faire un test d'intégration sur un in-memory...

Vous allez donc compléter le repository `webinar-repository.prisma.ts` pour implémenter correctement l'interface...
Sans oublier la méthode `delete` qui nous intéresse ici.

> 💡 Dans le TP sur les tests, nous avions réalisé la même opération...

#### Écriture du test d'intégration

> 💡 La mise en place d'un test d'intégration est naturellement plus complexe que celle du test unitaire
> Si vous vous souvenez bien, nous avions réaliser la même chose dans un TP : setup de BDD etc...

La structure à respecter est la même qu'un TU.

Vous allez ici chercher à tester la logique de suppression particulièrement :

- créer un webinaire (ARRANGE)
- executer la méthode de suppression du repository prisma (ACT)
- vérifier avec le `prismaClient` que le webinaire est bien supprimé (ASSERT)

### Création du test E2E

#### Développement d'une nouvelle route

> 💡 Une route est déjà présente dans le fichier `routes.ts`

À vous d'écrire la route correspondante pour la suppression en vous en inspirant.

Dans le TP tests, nous avions utilisé `fastify` pour passer un paramètre à notre route, afin d'utiliser l'ID dans `/webinars/:id`...

#### Écriture du test E2E

> 💡 Une fixture de mise en place est déjà présente dans le dossier `src/tests/fixtures.ts`

À vous d'écrire le test correspondant dans un fichier `src/api.e2e.test.ts` en vous aidant de la fixture et de ce que l'on a déjà réalisé pour le TP tests.

On va venir chercher à :

- créer un webinaire avec le prismaClient (ARRANGE)
- appeler la route créée avec `supertest` (ACT)
- vérifier que le webinaire est bien supprimé avec le prismaClient (ASSERT)
- vérifier que le code http de retour est le bon
- vérifier le comportement dans nos wrong path (levée d'erreurs)
