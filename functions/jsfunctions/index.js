/**
 * Describe Jsfunctions here.
 *
 * The exported method is the entry point for your code when the function is invoked. 
 *
 * Following parameters are pre-configured and provided to your function on execution: 
 * @param event: represents the data associated with the occurrence of an event, and  
 *                 supporting metadata about the source of that occurrence.
 * @param context: represents the connection to Functions and your Salesforce org.
 * @param logger: logging handler used to capture application logs and trace specifically
 *                 to a given execution of a function.
 */

import fastify from "fastify-js";
import jsonruleengine from "json-rules-engine-js";
export default async function (event, context, logger) {

    const fastify = fastify();
    const engine = jsonruleengine();

    engine.addRule({
        conditions: {
          all: [
            {
              fact: "temperature",
              operator: "equal",
              value: 100
            }
          ]
        },
        onSuccess(){
          console.log('on success called')
        },
        onFailure(){
          console.log('on failure called')
        },
        event: {
          type: "message",
          params: {
            data: "hello-world!"
          }
        }
      });
      
    const facts = { temperature: 100 };
    engine
    .run(facts)
    .then(results => {
        results.events.map(event => console.log('value', event.params.data));
    })
    .catch((error)=> console.log('err is', error));
    
    logger.info(`Invoking Jsfunctions with payload ${JSON.stringify(event.data || {})}`);

    const results = await context.org.dataApi.query('SELECT Id, Name FROM Account');


    logger.info(JSON.stringify(results));

    return results;
}
