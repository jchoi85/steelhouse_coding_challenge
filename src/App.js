import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount(){
    console.log("Strip Url Parameters:");
    console.log(this.stripUrlParams('www.steelhouse.com?a=1&b=2&a=2')); // returns 'www.steelhouse.com?a=1&b=2'
    console.log(this.stripUrlParams('www.steelhouse.com?a=1&b=2&a=2', ['b'])); // returns 'www.steelhouse.com?a=1'
    console.log(this.stripUrlParams('www.steelhouse.com', ['b'])); // returns 'www.steelhouse.com'

    console.log("");
    console.log("Equal Arrays:");
    console.log(this.equalArray([1,2,3,4,3,2,1])); // returns 3
    console.log(this.equalArray([1,100,50,-51,1,1])); // returns 1
    console.log(this.equalArray([15,2,-1])); // returns -1

    console.log("");
    console.log("Word Break:");
    console.log(this.wordBreak(dictWords, "steelhouse")); // returns ["steel", "house"]
    console.log(this.wordBreak(dictWords, "tobeornottobethatisthequestion")); // returns ["to", "be", "or", "not", "that", "is", "the" "question"]
  }

  constructor(props){
    super(props);
    this.state = {
      search: "",
      showSuggestions: false,
      suggestions: []
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <input value={this.state.search} onChange={this.onFieldChange} />
        </p>
          {this.state.showSuggestions ? 
            this.state.suggestions.map((sugg, index) => this.addSuggestion(sugg, index))
            :
            ""
          }
      </div>
    );
  }

  onFieldChange = (e) => { // when user types, this function will run
    let showSuggestions = e.target.value !== ""; // if field is empty, hide suggestions
    let suggestions = [];
    for(let i = 0; i < cities.length; i++){ // check to see if value matches any suggestions
      if(e.target.value.toLowerCase() === cities[i].substr(0, e.target.value.length).toLowerCase()) suggestions.push(cities[i]);
    }
    if(suggestions.length === 0) suggestions[0] = "No Cities Found"; // if no matches found, set suggestions to no cities found
    this.setState({ // set state with updated values
      search: e.target.value,
      showSuggestions,
      suggestions
    })
  }

  addSuggestion = (city, index) => { // list out all suggestions below input
    return (
      <p key={index}>
        {city}
      </p>
    )
  }

  stripUrlParams = (url, params) => {
    let newUrl = url.split("?"); // split url into front url and any parameters after the ?
    if(!newUrl[1]) return newUrl[0]; // if no parameters are found, return the url as-is

    let newParams = newUrl[1].split("&"); // split params at the &
    let removeParamsDict = {}; // hash table for optional params to remove

    if(params){ // if passed params to remove, create hash table
      for(let i = 0; i < params.length; i++){
        removeParamsDict[params[i]] = true;
      }
    }
    let paramsDict = {};  // hash table for params found
    let indexToRemove = []; // stack for indices to flag for removal
    for(let i = 0; i < newParams.length; i++){
      if(paramsDict[newParams[i][0]] || removeParamsDict[newParams[i][0]]) // if duplicate param is found or param is on list to remove, flag it by adding to stack
        indexToRemove.push(i);
      else
        paramsDict[newParams[i][0]] = true; // if param does not exist in hashtable, it means it is being seen for the first time so add to hash table
    }

    while(indexToRemove.length){
      newParams.splice(indexToRemove.pop(), 1); // remove all elements flagged in reverse order (needs to be reverse order to maintain indexes)
    }

    return newParams.length > 0 ? newUrl[0] + "?" + newParams.join("&") : newUrl[0]; // if there are no params left, return url only otherwise return url with params
  }

  equalArray = (arr) => { // let's use binary search to cut down on our run time!
    let start = 0;
    let mid = Math.floor(arr.length/2); // set initial midpoint at the mid of the array (use floor to account for arrays with odd number of elements)
    let end = arr.length;
 
    function getSum(total, num){
      return total+num;
    }

    for(let i = 0; i < Math.ceil(arr.length/2); i++){ // only run as many times as half the elements, since this is binary search
      let sumLeft = arr.slice(start, mid + 1).reduce(getSum); // caluclate sums of left and right sides
      let sumRight = arr.slice(mid, end).reduce(getSum);

      if(sumLeft === sumRight) return mid; // if equal, return index
      
      if(sumLeft > sumRight){ // if left side is larger, move midpoint left

        mid = Math.ceil((mid + start)/2);
      }
      else{
        mid = mid + Math.ceil((mid + end)/2);
      }
    }
    return -1; // if for loop exits without finding a match, return -1
  }

  wordBreak = (dictWords, str) => {
    let dict = {}; // convert array of dict words to hash table
    for(let i = 0; i < dictWords.length; i++){
      dict[dictWords[i]] = 1;
    }

    let word = "";
    let results = [];
    let matchFound = true;
    
    while(matchFound){
      matchFound = false;
      for(let i = 0; i < str.length; i++){ // run through string and attempt to break words
        word += str[i];
        if(dict[word] === 1){ // if word is found and it's the first time seeing it, add it to results
          dict[word]++; // increment by 1 to ignore the next time it's found
          results.push(word);
          word = "";
          matchFound = true; // if entire string goes through without finding a match, function will terminate
        } else if(dict[word]){ // if word is found but not the first time, move on
          word = "";
        }
      }
      if(word !== ""){ // if there are still letters remaining, go back and try to go to a longer word at last found match
        str = word; // rerun function using remaining string
        word = results.pop();
      }else{
        break;
      }
      if(!matchFound) return undefined; // if no strings can be found in the string, return undefined
    }

    return results; 
  }  
}

export default App;

const dictWords = [
  "american","four","i","john","may","mr","mrs","us","united","a",
  "about","act","after","again","against","all","almost","along","also","always",
  "am","among","an","and","another","any","are","around","as","asked",
  "at","away","back","be","because","steel", "house", "become","been","before","began","best",
  "better","between","big","both","business","but","by","called","came","can",
  "case","certain","change","child","children","church","city","close","come","company",
  "could","country","course","day","days","development","did","didn't","do","does",
  "don't","done","down","during","each","early","end","enough","even","ever",
  "every","eyes","face","fact","family","far","feel","felt","few","find",
  "first","for","form","from","general","get","give","given","go","god",
  "going","good","got","govern","government","great","group","had","hand","has",
  "have","he","head","help","her","here","high","him","himself","his",
  "home","house","how","however","if","important","in","interest","into","is",
  "it","its","just","keep","kind","knew","know","large","last","later",
  "law","least","leave","less","let","life","light","like","line","little",
  "long","look","looked","made","make","man","many","matter","me","mean",
  "means","members","men","might","mind","more","most","much","must","my",
  "name","national","need","never","new","next","night","no","not","nothing",
  "now","number","of","off","often","old","on","once","one","only",
  "open","or","order","other","others","our","out","over","own","part",
  "people","per","place","point","possible","power","present","president","problem","program",
  "public","put","question","rather","real","right","room","said","same","say",
  "school","second","see","seem","seemed","sense","service","set","several","she",
  "should","show","side","since","small","so","social","some","something","state",
  "states","still","such","system","take","tell","than","that","the","their",
  "them","then","there","these","they","thing","things","think","this","those",
  "though","thought","three","through","time","to","told","too","took","toward",
  "turn","turned","two","under","unite","until","up","upon","use","used",
  "very","want","war","was","water","way","we","week","well","went",
  "were","what","when","where","which","while","white","who","why","will",
  "with","within","without","word","work","would","year","yet","you","young",
  "your"
];

const cities = [
  'Chicago',
  'Los Angeles',
  'Santa Cruz',
  'Santa Ana',
  'Los Gatos'
];