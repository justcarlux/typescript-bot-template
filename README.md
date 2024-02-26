# 🤖 TypeScript Bot Template
Discord.js bot template made in TypeScript with minimal dependencies.

## 🎉 Features
- Compatible with the latest version of Discord.js.
- Code properly made using Object Oriented Programming.
- Client Event and Discord API REST Event handlers.
- Text-based Commands handler.
- Slash Commands, Sub-Commands (with Subcommand groups) and Autocompletions Interactions handlers.
- Button Interactions handler.
- Menu Interactions handler.
- Every handler supports subfolders (built-in directory walker).
- Modal Interactions handler.
- Configuration loader.
- Exception catcher (informally known as "anti-crash").
- Built-in reload and eval command.
- Built-in command for refreshing Slash Commands and also an option for refreshing them every time the bot joins a new guild.
- Examples of everything above.

## 💻 Running

- Install Node.js if you don't have it. This template was developed and tested in versions above **18+**.
- Clone this repository.
- Install all the required dependencies with `npm install`.
- Copy the contents of `example.env` in a new file called `.env` and fill in everything that is needed. Then do the same for `config.example.ts`, in this case the new file has to be called `config.ts`. The `example.env` file contains comments to help you understand what the settings do; same for `config.example`, but the documentation is located on the `src/structures/IConfiguration.ts` interface itself.
- Build the proyect using `npm run build`. Then run `npm run start:build` to start the bot.
- You can also just run `npm run start:dev` to run the proyect using **ts-node**.
- You can also use `npm run start:watch` to run the proyect using **ts-node** with **nodemon**.

**Important**: all commands must be executed in the root directory of the proyect. Avoid running from folders like `dist` or `src`. It's also recommended to only use the scripts that the proyect has (from `package.json`) to build or run it. If you don't do any of these, you can probably get file/module find errors.