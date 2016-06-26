import Rx, {Observable} from "rx";
import "rx-dom";
import $ from "jquery";

const createToolTip = (id) => {
  const $el = $("<div/>").attr("id", id).css({
    position: "fixed",
    backgroundColor: "rgba(255,255,255, 0.9)",
    borderRadius: "10px"
  }).appendTo(document.body);
  return {
    getValue() { return $el.get(0);},
    dispose() { $el.remove();}
  };
};

const rxImages =
["map", "mergeAll", "tap", "repeat", "delaySubscription", "interval", "Catch", "take", "takeUntil", "just", "startWith", "debounce", "merge", "combineLatest", "scan", "reduce", "filter", "switch", "distinctUntilChanged", "flatMap"].reduce((acc, op) => ({[op.toLowerCase()]: `http://reactivex.io/documentation/operators/images/${op}.png`, ...acc } ), {});

Rx.Observable.fromEvent(document.body, "mousemove")
             .distinctUntilChanged(e => e.target)
             .debounce(400)
             .filter(e => !Array.from($(e.target).parents()).some(x => x.id === "op-tooltip"))
             .flatMapLatest(e => Observable.just(e.target)
                  .filter(el => el.classList.contains("token"))
                  .map(el => el.textContent)
                  .map(op => op && op.toLowerCase())
                  .filter(op => op && rxImages[op])
                  .flatMap(op => Observable.using(() => createToolTip("op-tooltip"), tip => {
                    console.log("creating tooltip");
                    const el = tip.getValue();
                    const {top, left} = e.target.getBoundingClientRect();

                    el.style.top = top + $(e.target).height() * 1.5 + "px";
                    el.style.left = left + "px";
                    console.log($(e.target).closest(".runner").width());
                    if ($(e.target).closest(".runner").width() === document.body.offsetWidth){ 
                      $(el).appendTo(e.target);
                    }
                    
                    $("<img/>").attr("src", rxImages[op])
                               .width(400)
                               .appendTo(el);

                    return Observable.never();
                  })))
             .subscribe();
