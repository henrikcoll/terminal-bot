import axios from "axios";
import { pelicanApiKey, pelicanUrl } from "./config.js";

export async function listServers() {
  const {
    data: { data },
  } = await axios.request({
    method: "GET",
    url: `${pelicanUrl}/api/client/`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${pelicanApiKey}`,
    },
  });

  return data.map((s) => s.attributes);
}

export async function getServerResources(identifier) {
  const {
    data: { attributes },
  } = await axios.request({
    method: "GET",
    url: `${pelicanUrl}/api/client/servers/${identifier}/resources`,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${pelicanApiKey}`,
    },
  });

  return attributes;
}

export async function sendServerPower(identifier, signal) {
  try {
    const { data } = await axios.request({
      method: "POST",
      url: `${pelicanUrl}/api/client/servers/${identifier}/power`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${pelicanApiKey}`,
      },
      data: { signal },
    });
    console.log({ data });
  } catch (e) {
    return false;
  }

  return true;
}
