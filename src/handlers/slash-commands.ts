import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../structures/Bot";
import { getConfig } from "../utils/configuration";

export default async (client: Bot, interaction: ChatInputCommandInteraction) => {

    if (getConfig().developerMode.activated && !getConfig().developerMode.channels.includes(interaction.channelId)) return;
    if (!getConfig().developerMode.activated && getConfig().developerMode.channels.includes(interaction.channelId)) return;

    if (interaction.user.bot) return;

    const command = client.interactions.commands.get(interaction.commandName);
    if (!command) return;
    
    if (interaction.channel?.isDMBased() || !interaction.guild) {
        // Generally I would add a return here. But if you want to make slash commands work in DMs delete this
    }

    if (interaction.options.getSubcommand(false)) {
        const subCommand = client.interactions.subcommands.find(subcmd => 
            subcmd.parent === command.data.name && subcmd.data.name === interaction.options.getSubcommand()
        );
        if (!subCommand) return;
        return subCommand.run(client, interaction);
    }

    return await command.run(client, interaction);

}