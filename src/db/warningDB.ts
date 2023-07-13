import { loggerBot } from "../utils/logger";
import pool from "./pool";

export interface GetCountWarning {
  warning: number;
}

export const getCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<GetCountWarning[]> => {
  const result = await pool.query(
    "SELECT warning FROM countmember WHERE memberjid=$1 AND groupjid=$2;",
    [memberjid, groupjid]
  );

  if (result.rowCount) {
    return result.rows;
  }
  return [];
};

export interface GetCountWarningAllGroup {
  memberjid: string;
  name: string;
  warning: number;
}

export const getCountWarningAllGroup = async (): Promise<
  GetCountWarningAllGroup[]
> => {
  const res = await pool.query(
    "SELECT countmember.memberjid, sum(countmember.warning) as warning, members.name FROM countmember INNER JOIN members ON countmember.memberjid=members.memberjid where warning>0 group by countmember.memberjid,members.name ORDER BY warning DESC;"
  );
  if (res.rowCount) {
    return res.rows;
  }
  return [];
};
export interface GetCountWarningAll {
  name: string;
  memberjid: string;
  warning: number;
}

export const getCountWarningAll = async (
  groupjid: string
): Promise<GetCountWarningAll[]> => {
  const res = await pool.query(
    "SELECT countmember.memberjid, countmember.warning, members.name FROM countmember INNER JOIN members ON countmember.memberjid=members.memberjid WHERE groupjid=$1 and warning>0 ORDER BY warning DESC;",
    [groupjid]
  );
  if (res.rowCount) {
    return res.rows;
  }
  return [];
};

export const setCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  try {
    if (!groupjid.endsWith("@g.us")) return false;

    const res = await pool.query(
      "UPDATE countmember SET warning = warning+1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );
    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    await loggerBot(undefined, "[setCountWarning DB]", error, undefined);
    return false;
  }
};

export const reduceCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  try {
    if (!groupjid.endsWith("@g.us")) return false;

    const res = await pool.query(
      "UPDATE countmember SET warning = warning-1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );
    if (res.rowCount === 1) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    await loggerBot(undefined, "[reduceCountWarning DB]", error, undefined);
    return false;
  }
};

export const clearCountWarning = async (
  memberjid: string,
  groupjid: string
): Promise<boolean> => {
  try {
    if (!groupjid.endsWith("@g.us")) return false;

    const res = await pool.query(
      "UPDATE countmember SET warning = 0 WHERE memberjid=$1 AND groupjid=$2;",
      [memberjid, groupjid]
    );

    if (res.rowCount === 1) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    await loggerBot(undefined, "[clearCountWarning DB]", error, undefined);
    return false;
  }
};
