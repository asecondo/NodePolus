import PolusBuffer from "../../../util/PolusBuffer.js";
import Component from "../../PacketElements/Component.js";
import Room from "../../../util/Room.js";
import { GameDataPacketType } from "../GameData.js";

export interface DataPacket {
  type: GameDataPacketType.Data,
	Component: Component;
}

export default class Data {
	constructor(private room:Room) {}
	parse(packet: PolusBuffer): DataPacket {
		let ComponentNetID = packet.readVarInt();
		let Component = this.room.GameObjects.map(e => e.Components).flat(1).find(comp => comp.netID == ComponentNetID);
		return {
			type: GameDataPacketType.Data,
			Component: Component.parse(packet)
		};
	}
	serialize(packet: DataPacket): PolusBuffer {
		let {Component} = packet;
		let ComponentNetID = Component.netID;
		let buf = new PolusBuffer();
		buf.writeVarInt(ComponentNetID);
		let serialized = Component.serialize();
		buf.writeBytes(serialized);
		return buf;
	};
};