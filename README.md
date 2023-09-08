# 🤖 TypeScript Bot Template
Basic Discord.js bot template made in TypeScript.

## 🎉 Features
- Code properly made using Object Oriented Programming.
- Text-based Commands handler (subfolders supported).
- Slash Commands, Sub-Commands and Autocompletions Interactions handler (subfolders supported).
- Button Interactions handler (subfolders supported).
- Menu Interactions handler (subfolders supported).
- Configuration loader.
- Exception catcher (informally known as "anti-crash").
- Built-in reload command.
- Examples of everything above.

## 💻 Running

- Install Node.js if you don't have it. The bot was developed and tested in version **18+**.
- Clone this repository.
- Install all the required dependencies with `npm install`.
- Copy the contents of `example.env` in a new file called `.env` and fill in everything that is needed. Then do the same for `config.example.ts`, here the new file has to be called `config.ts`. The `example` files contain comments to help you understand what the settings do.
- Build the proyect using `npm run build`. Then run `npm run start:build` to start the bot.
- You can also just run `npm run start:dev` to run the proyect using **ts-node**.

**Important**: all the commands must be executed in the root directory of the proyect. Avoid running from folders like `dist` or `src`. It's also recommended to only use the scripts that the proyect has (from `package.json`) to build or run it. If you don't do any of these, you can probably get file/module find errors.