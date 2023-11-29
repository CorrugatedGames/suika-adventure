# Suika Adventure

## Getting Started

Ensure you have NodeJS v18 (needed for structuredClone).

1. `npm i`

## Running the Game

`npm start`

## Development-related Topics

### Debug Commands

You must have debug mode enabled for any of these to work.

### Creating a New Page

`npx n g g page pages/[page-name]`

### Creating a New Service

`npx ng g service services/[service-name]`

### Creating a New Data Store

1. Create the 5 files in any category in `stores/`
1. Add the store to `stores/index.ts`
1. Add the migrations file to `stores/migrations.ts`

### Adding a New Sound Effect

1. Make the sound effect (BFXR)
1. Compress the sound effect [here](https://www.freeconvert.com/wav-compressor) (if it doesn't compress, use the original)
1. Place it in `src/assets/sfx`
