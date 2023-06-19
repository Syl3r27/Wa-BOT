import { GroupParticipant, WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { addBlacklist } from "../../db/blacklistDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply, args, sender } = msgInfoObj;

  if (args.length < 2) {
    await reply(`❌ Wrong query!\nSend ${prefix}bla number reason`);
    return;
  }

  let blacklistNumb = args[0];
  if (!Number(blacklistNumb)) {
    await reply(
      `❌ Give correct Indian number (without spaces) with reason to add in blacklist by ${prefix}bla number reason`
    );
    return;
  }

  const reason = args.slice(1).join(" ");
  if (!reason) {
    await reply(`❌ Incorrect reason!\nSend ${prefix}bla number reason`);
    return;
  }

  if (blacklistNumb.startsWith("+")) {
    blacklistNumb = blacklistNumb.slice(1);
  }
  if (blacklistNumb.length === 10) {
    blacklistNumb = `91${blacklistNumb}`;
  }

  if (blacklistNumb.length !== 12) {
    await reply(
      `❌ Give correct Indian number (without spaces) with reason to add in blacklist by ${prefix}bla number reason`
    );
    return;
  }

  const addBlacklistRes = await addBlacklist(blacklistNumb, reason, sender);
  await reply(addBlacklistRes);

  const blacklistNumbWithJid = `${blacklistNumb}@s.whatsapp.net`;
  const chats = await bot.groupFetchAllParticipating();
  const groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>"))
    .map((v) => ({
      subject: v.subject,
      id: v.id,
      participants: v.participants,
    }));
  // console.log(groups);

  let pvxMsg = `*BLacklisted number is in following PVX groups*:\n`;

  groups.forEach((group) => {
    group.participants.forEach(async (mem: GroupParticipant) => {
      if (mem.id === blacklistNumbWithJid) {
        pvxMsg += `\n*${group.subject}*`;
      }
    });
  });

  await reply(pvxMsg);
};

const blacklistadd = () => {
  const cmd = ["blacklistadd", "addblacklist", "bla"];

  return { cmd, handler };
};

export default blacklistadd;
