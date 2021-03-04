import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Servient, Helpers } from '@node-wot/core';
import { HttpClientFactory } from "@node-wot/binding-http";
import { AuthModule } from '../src/auth/auth.module';
var dataTest = require('./dataTest');

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let servient = new Servient();
     servient.addCredentials({
         "thing:1": {
             token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVsZW5hIiwic3ViIjoxLCJpYXQiOjE2MTM5MTc2MTcsImV4cCI6MTYxMzkxNzc5N30.JJZ1ml1SyT2iBUZ0QBZ_6MiOgMhtlWHl9D-D5KRV8bc"
              }});
        
    servient.addClientFactory(new HttpClientFactory(null));

    let wotHelper = new Helpers(servient);

    beforeEach(async () => {
       // jest.spyOn(console, 'warn').mockImplementation(() => { });
       // jest.spyOn(console, 'debug').mockImplementation(() => { });
       // jest.spyOn(console, 'log').mockImplementation(() => { });
        await dataTest.initializeDB();
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, AuthModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    
        it("should invoke Action createTD", async () => {
            await wotHelper.fetch("http://localhost:3000").then(async (td) => {
                
                    await  servient.start().then(async (WoT) => {
                    
                        await  WoT.consume(td).then(async (thing) => {
                                
                            
                            await thing.invokeAction("createTD", dataTest.newtd, undefined);
                           
                        });
                    });
            }).catch((err) => { console.error("Fetch error:", err); });
            expect(201);
        });
    
     it("should invoke Action deleteTD", async () => {
            await wotHelper.fetch("http://localhost:3000").then(async (td) => {
                
                    await  servient.start().then(async (WoT) => {
                        await  WoT.consume(td).then(async (thing) => {
    
                          
                            await thing.invokeAction("deleteTD", undefined, {"uriVariables":{ id: "1"}});
                           
                        });
                    });
            }).catch((err) => { console.error("Fetch error:", err); });
            expect(201);
        });
    
   
    it("should readProperty retrieveTD", async () => {
        await wotHelper.fetch("http://localhost:3000").then(async (td) => {
            try {
                await servient.start().then(async (WoT) => {
                    await WoT.consume(td).then(async (thing) => {


                        let ris = await thing.readProperty("retrieveTD", { "uriVariables": { id: "1" } });
                        expect(ris).toStrictEqual(dataTest.td);
                    });
                });
            } catch (err) {
                console.error("Script error:", err);
            }
        }).catch((err) => { console.error("Fetch error:", err); });

    });
    
    it("should readProperty searchJSONPath", async () => {
        await wotHelper.fetch("http://localhost:3000").then(async (td) => {
            try {
                await servient.start().then(async (WoT) => {
                   await WoT.consume(td).then(async (thing) => {
    
                       let ris= await thing.readProperty("searchJSONPath", {"uriVariables":{ query: "$.actions.decrement"}});
                       expect(ris).toStrictEqual(dataTest.searchtd);
                    });
                });
            } catch (err) {
                console.error("Script error:", err);
            }
        }).catch((err) => { console.error("Fetch error:", err); });
        
    });
    
    
});