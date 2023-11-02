import * as amqp from "amqplib";

export default new (class MessageQueue {
  async MessageSend(queueName: string, payload: any): Promise<Boolean> {
    try {
      const connection = await amqp.connect("amqps://rsvliwsi:HMu8AWB3r97ziFK5-JVXKhbnJ7Fcp6oK@octopus.rmq3.cloudamqp.com/rsvliwsi");
      const channel = await connection.createChannel();

      await channel.assertQueue(queueName);
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));
      await channel.close();
      await connection.close();
      return null;
    } catch (error) {
      return error;
    }
  }
})();
