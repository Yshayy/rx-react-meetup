// Import React
import React, {Component} from "react";
import Runner from "./helpers/Runner";
import ConsoleOutput from "./helpers/outputs/Console";
import DomOutput from "./helpers/outputs/Dom";
import Rx, {Observable, Subject} from "rx";
import { createComponent, createEventHandler } from "rx-recompose";
import ReactDOM from "react-dom";
import "rx-dom";
require("./helpers/inject-op-tooltips");
require("./index.css");

// Import Spectacle Core tags
import {
  Appear,
  BlockQuote,
  Cite,
  CodePane,
  Deck,
  Fill,
  Heading,
  Image,
  Layout,
  Link,
  ListItem,
  List,
  Markdown,
  Quote,
  Slide,
  Spectacle,
  Text
} from "spectacle";

// Import image preloader util
import preloader from "spectacle/lib/utils/preloader";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Import custom component
import Interactive from "../assets/interactive";

// Require CSS
require("normalize.css");
require("spectacle/lib/themes/default/index.css");

const images = {
  city: require("../assets/city.jpg"),
  kat: require("../assets/kat.png"),
  logo: require("../assets/formidable-logo.svg"),
  markdown: require("../assets/markdown.png")
};

preloader(images);

const theme = createTheme({
  background: "#555a5f",
  primary: "#555a5f",
  secondary: "white",
  rx: "#dddddd"
});

const tradeSlides = require("raw!../assets/stocks/trade.js.asset").split("###");

const addSomeRandomness = (x) => x + Math.round(Math.random() * 10) * 0.00001 * ((Math.random() > 0.5) ? 1 : -1);

const RxImports = {Rx, Observable, Subject};
const ReactImports = {React, ReactDOM, Component};
const RecomposeImports = { createComponent, createEventHandler };
const getTranslationUrl = (text) => `https://api-platform.systran.net/translation/text/translate?input=${text}&source=en&target=it&withSource=false&withAnnotations=false&backTranslation=false&encoding=utf-8&key=53db3c6e-55f4-4f0f-971c-ea17891d5d16`;
const translateImports = {
  ...RxImports,
  translateAsync: (text) => Observable.fromPromise(
   () => fetch(getTranslationUrl(text))
        .then((res) => res.json())
        .then((res) => res.outputs[0].output)),
  appendLine: (el, line) => el.textContent = line + "\n" + el.textContent
};

const tradeImports = {
  ...RxImports,
  formatCurrency(price) { return Math.round(price * 1000) / 1000;},
  fetchStockData(symbol) {
    const url = "http://cors.io/?u=" + encodeURIComponent(`http://finance.google.com/finance/info?client=ig&q=${symbol}`);
    const extractPrice = (txt) => parseFloat(JSON.parse(txt.substr(3))[0].l.replace(/,/g, ""));
    return Observable.fromPromise(() =>
      fetch(url)
      .then(res => res.text())
      .then(txt => extractPrice(txt))
      .then(addSomeRandomness)
    );
  }
};

export default class Presentation extends React.Component {
  render() {
    return (
      <Spectacle theme={theme}>
        <Deck transition={["zoom", "slide"]} transitionDuration={500}>
          <Slide transition={["zoom"]} bgColor="background" >
            <Heading size={4} lineHeight={1} textColor="rx">
              Reactive Programming With
            </Heading>
            <Heading size={1} fit caps textColor="rx">
               Reactive Extensions (RX)
            </Heading>
            <Link href="https://github.com/Yshayy/rx-react-meetup">
              <Text bold caps textColor="tertiary">View on Github</Text>
            </Link>
            <Text textColor="secondary" textSize="1.5em" margin="20px 0px 0px" bold>yshay@soluto.com</Text>
          </Slide>
          <Slide transition={["slide"]} bgColor="background" notes="You can even put notes on your slide. How awesome is that?">
            <Heading size={2} caps textColor="secondary" textFont="primary">
              About me
            </Heading>
            <List>
              <ListItem>Tech lead at Soluto</ListItem>
              <Appear><ListItem>Enthusiastic Rx user for ~3 years</ListItem></Appear>
              <Appear><ListItem>Architecture, design, programming languages and building stuff</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={["slide"]} bgColor="background" notes="You can even put notes on your slide. How awesome is that?">
            <Heading size={2} caps textColor="secondary" textFont="primary">
              Rx in Soluto
            </Heading>
            <List>
              <Appear><ListItem>Used everywhere web/mobile/backend/tools</ListItem></Appear>
              <Appear><ListItem>Helped us solve complex problems elegantly</ListItem></Appear>
              <Appear><ListItem>Changed our thinking approach to solving problems</ListItem></Appear>
              <Appear><ListItem>Gave us alot of programming "WOW" moments</ListItem></Appear>
              <Appear><ListItem>Improved our overall adoption of FP concepts</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={["slide"]} bgColor="background" notes="You can even put notes on your slide. How awesome is that?">
            <Heading size={4} caps fit textColor="secondary" textFont="primary">
              Let's start with Rx!
            </Heading>
          </Slide>
          <Slide>
          <Heading size={4} caps textColor="secondary" textFont="primary">
              What is Rx?
          </Heading>
          <iframe src="http://reactivex.io/" style={{width: "100%", height: 600}} />
          </Slide>
          <Slide>
          <Heading size={4} caps textColor="secondary" textFont="primary">
              What is Rx?
          </Heading>
          <List>
            <ListItem>"An API for asynchronous programming with observable streams" (reactivex.io)</ListItem>
            <Appear><ListItem>??</ListItem></Appear>
            <Appear><ListItem>"Rx is a combination of the best ideas from the Observer pattern, the Iterator pattern, and functional programming"
            (reactivex.io)
            </ListItem></Appear>
            <Appear><ListItem>????</ListItem></Appear>
            </List>
          </Slide>
          <Slide>
            <Image src="http://images.cryhavok.org/d/13825-2/Wat.jpg" />
          </Slide>
          <Slide>
            <Heading fit caps textColor="secondary" textFont="primary">
                Rx is all about collections!
            </Heading>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary" notes="<ul><li>talk about that</li><li>and that</li></ul>">
              <div>
              <Heading size={6} textColor="secondary">Array - Collection over space (memory based)</Heading>
              <Runner code={require("raw!../assets/simple-collections/array.js.asset").split("###")} maxLines={8} >
              <ConsoleOutput/>
              </Runner>
              </div>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary" >
            <Heading fit textColor="secondary">Introducing Observables</Heading>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary" >
              <div>
              <Heading size={6} textColor="secondary">Array - Collection over space (memory based)</Heading>
              <Runner code={require("raw!../assets/simple-collections/array.js.asset").split("###")} maxLines={8} >
              <ConsoleOutput/>
              </Runner>
              </div>
              <div>
              <Heading size={6} textColor="secondary">Observable - Collection over time (event based)</Heading>
              <Runner maxLines={8} code={require("raw!../assets/simple-collections/rx.js.asset").split("###")}
                imports={{Observable}}
              >
              <ConsoleOutput/>
              </Runner>
              </div>
          </Slide>
          <Slide transition={["slide"]} bgDarken={0.75}>
            <Text caps size={1} textColor="secondary" >
                If we look on Event streams as collections...
                <br/>
             </Text>
             <Appear>
             <Text margin={25} caps textColor="secondary">
                We can use all our collection tools and knowledge to process events which lead us to...
             </Text>
             </Appear>
             <Appear>
             <Text caps fit textColor="secondary">
                Functional Programming!
             </Text>
             </Appear>
          </Slide>
          <Slide transition={["slide"]} bgDarken={0.75}>
            <Text size={2} textColor="secondary" >
                And that's the essence of RX and reactive programming/FRP
             </Text>
          </Slide>
          <Slide transition={["slide"]} bgDarken={0.75}>
            <Heading caps size={2} textColor="secondary" >
                Definitions
             </Heading>
             <List>
             <ListItem>Event stream == Observable</ListItem>
             <ListItem>Operator - function that return observable from other observable like map, filter, etc...</ListItem>
             </List>
          </Slide>
          <Slide transition={["slide"]} bgDarken={0.75}>
            <Heading caps size={4} textColor="secondary" >
                Observable can emit
             </Heading>
             <List>
             <ListItem>Value event</ListItem>
             <ListItem>Completion event</ListItem>
             <ListItem>Error event</ListItem>
             </List>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading size={4} textColor="secondary" caps>Translate Example</Heading>
            <Runner maxLines={15} code={require("raw!../assets/translate/translate.js.asset").split("###")}
              imports={{...translateImports,
                getInputElement:({elems:{translateExampleInput}}) => translateExampleInput,
                getViewElement:({elems:{translateExampleOutput}}) => translateExampleOutput
              }} >
              <DomOutput>
                  <input type="text" id="translateExampleInput" ></input>
                  <pre style={{maxHeight: 200, overflow: "auto"}} id="translateExampleOutput"></pre>
              </DomOutput>
           </Runner>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading caps>Rx timeline</Heading>
            <List>
              <ListItem>2007 - Rx is born based on dualizing Iterable/Iterator interfaces</ListItem>
              <Appear><ListItem>2009 - Rx.Net Released </ListItem></Appear>
              <Appear><ListItem>2010 - RxJs</ListItem></Appear>
              <Appear><ListItem>2010 - IObserable & IObserver are standardized in .net 4</ListItem></Appear>
              <Appear><ListItem>2012 - Rx get open-sourced</ListItem></Appear>
            </List>
          </Slide>
          <Slide bgColor="primary" transitionDuration={0} >
            <Heading size={2} caps>Rx timeline </Heading>
            <List>
              <ListItem>2012 - Work started on RxJava</ListItem>
              <Appear><ListItem>2014 - RxJava 1.0</ListItem></Appear>
              <Appear><ListItem>2015 - Reactive Streams for Java 9</ListItem></Appear>
              <Appear><ListItem>2015 - Obserable in ECMAScript (stage 1)</ListItem></Appear>
              <Appear><ListItem>2015 - RxJS is rebuilt from scratch (rxjs-5)</ListItem></Appear>
            </List>
          </Slide>
          <Slide bgColor="primary" transitionDuration={0} >
            <Heading size={2} caps>Rx timeline </Heading>
            <List>
              <ListItem>Ports in many languages from ruby to c++</ListItem>
              <Appear><ListItem>Ports in many platforms</ListItem></Appear>
              <Appear><ListItem>Many clones/heavily inspired libs especially in js world</ListItem></Appear>
              <Appear><ListItem>bacon.js, kefir.js, highland.js, most.js, xtream.js</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading size={2} caps>Rx timeline</Heading>
            <List>
              <ListItem>Rx is a bit trending now but it's hardly new</ListItem>
              <Appear><ListItem>Rx is backed by powerful players (Microsoft, Netflix, Google...)</ListItem></Appear>
              <Appear><ListItem>Expect Observables to be everywhere in js future</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading caps fit>More Examples</Heading>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading size={5} textColor="secondary" caps>Drag Example</Heading>
            <Runner maxLines={20} code={require("raw!../assets/drag/drag.js.asset").split("###")}
              imports={{...RxImports,
                moveTo(element, x, y) {
                  document.body.appendChild(element);
                  element.style.position = "fixed";
                  element.style.left = x + "px";
                  element.style.top = y + "px";
                },
                backToPosition: (element) => {
                  const parent = element.parentNode;
                  return () => {
                    parent.appendChild(element);
                    element.style.position = "static";
                    element.style.left = 0;
                    element.style.top = 0;
                  };
                },
                getElement: ({elems: {draggable}}) => draggable
              }} >
              <DomOutput>
                    <div id="draggable" style={{width: 50, height: 50, backgroundColor: "red"}} />
              </DomOutput>
           </Runner>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading size={5} textColor="secondary" caps>Scan operator</Heading>
            <Runner imports={{Observable}} code={require("raw!../assets/scan/scan.js.asset").split("###")} maxLines={8} >
              <ConsoleOutput/>
              </Runner>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading size={5} textColor="secondary" caps>Scan - Counter Example</Heading>
            <Runner maxLines={20} code={require("raw!../assets/scan/counter.js.asset").split("###")}
              imports={{...RxImports,
                getIncrementButton: ({elems: {inc}}) => inc,
                getDecrementButton: ({elems: {dec}}) => dec,
                getCounterView: ({elems: {counterView}}) => counterView
              }}
            >
              <DomOutput>
                  <div id="counterView">0</div>
                  <button id="inc" >+</button>
                  <button id="dec" >-</button>
              </DomOutput>
           </Runner>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading size={5} textColor="secondary" caps>Bitcoin Converter</Heading>
            <Runner maxLines={20} code={[...tradeSlides, tradeSlides[0]]}
              imports={{...tradeImports,
                getInputElement: ({elems: {btcInput}}) => btcInput,
                getViewElement: ({elems: {ilsOutput}}) => ilsOutput
              }}
            >
              <DomOutput>
                  <input placeholder="Enter BTC amount" id="btcInput" ></input>
                  <div id="ilsOutput" ></div>
              </DomOutput>
           </Runner>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Text textSize="3.5rem" textColor="secondary">Rx can be used everywhere, but it really shines in</Text>
            <List>
              <Appear><ListItem>Things that related to time</ListItem></Appear>
              <Appear><ListItem>Realtime UI for live data</ListItem></Appear>
              <Appear><ListItem>Complex user intents - drag&drop, long presses, gestures...</ListItem></Appear>
              <Appear><ListItem>Complex async processing</ListItem></Appear>
              <Appear><ListItem>Abstraction</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading>But beware...</Heading>
            <List>
              <Appear><ListItem>Rx has a steep learning curve</ListItem></Appear>
              <Appear><ListItem>Rx can sometime be too smart for it's own good</ListItem></Appear>
              <Appear><ListItem>Rx require a lot of commitment for a library</ListItem></Appear>
              <Appear><ListItem>Debugging is non-trival</ListItem></Appear>
              <Appear><ListItem>Don't give up on Promises</ListItem></Appear>
              <Appear><ListItem>Don't settle with ugly Rx solutions</ListItem></Appear>
              <Appear><ListItem>Don't forget to dispose your subscriptions</ListItem></Appear>
            </List>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Text textSize="1.5em" textColor="secondary" caps>26/6 - Rx-Israel first meetup here in Soluto </Text>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading caps fit>Questions</Heading>
          </Slide>
          <Slide transition={["zoom", "fade"]} bgColor="primary">
            <Heading caps fit>Appendix</Heading>
          </Slide>
        </Deck>
      </Spectacle>
    );
  }
}

