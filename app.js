const { DynamoDBClient, } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb")

async function main() {
  const client = new DynamoDBClient({
    endpoint: "http://localhost:8000",
    region: "localhost",
    // for some weird reason the local dev also need some of this
    // credentials.
    credentials: {
      secretAccessKey: "somdumbkey",
      accessKeyId: "anotherdumbkey"
    }
  });

  const doc_client = DynamoDBDocumentClient.from(client);
  // prepare any command then call the command with the client
  const get_item_command = new GetCommand({
    TableName: "employees",
    Key: {
      // need to pass both the partion key and the sort key
      // if the table creation include both.
      emp_id: 1,
      cat_id: 1
    }

  })
  const single_item_reponse = await doc_client.send(get_item_command);
  const item = single_item_reponse.Item;
  console.log("single_item_reponse is", item)

  // get all items with the matched condition
  const get_matched_items = new ScanCommand({
    TableName: "employees"
  })
  const all_items_reponse = await doc_client.send(get_matched_items);
  const items = all_items_reponse.Items;
  const count = all_items_reponse.Count;
  console.log("items and count", items, 'count', count);
}

// this is the main function.
main();
