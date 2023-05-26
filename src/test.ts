import { OBSResponseTypes } from "obs-websocket-js";

const testScenes = {
  currentPreviewSceneName: "",
  currentProgramSceneName: "",
  scenes: [
    {
      sceneIndex: 0,
      sceneName: "Scene"
    },
    {
      sceneIndex: 1,
      sceneName: "Audio Sources"
    },
    {
      sceneIndex: 2,
      sceneName: "Main Scene"
    },
    {
      sceneIndex: 3,
      sceneName: "Bluey Replay"
    },
    {
      sceneIndex: 4,
      sceneName: "Orangey Replay"
    },
    {
      sceneIndex: 5,
      sceneName: "Bluey Win"
    },
    {
      sceneIndex: 6,
      sceneName: "Orangey Win"
    },
    {
      sceneIndex: 7,
      sceneName: "Test LOL"
    },
    {
      sceneIndex: 8,
      sceneName: "Greeney Win"
    },
    {
      sceneIndex: 9,
      sceneName: "Purpley Win"
    },
    {
      sceneIndex: 10,
      sceneName: "Pinky Win"
    },
    {
      sceneIndex: 11,
      sceneName: "Another Test"
    },
    {
      sceneIndex: 12,
      sceneName: "Mouse Red"
    },
    {
      sceneIndex: 13,
      sceneName: "Keyboard Red"
    },
    {
      sceneIndex: 14,
      sceneName: "Another"
    },
  ]
  
}

const testArr = [
  "Scene",
  "Audio Sources",
  "Main Scene",
  "Bluey Replay",
  "Orangey Replay",
  "Bluey Win",
  "Orangey Win",
  "Test LOL",
  "Greeney Win",
  "Purpley Win",
  "Pinky Win",
  "Another Test",
  "Mouse Red",
  "Keyboard Red",
  "Another"
];

let endArr = [];

(() => {
  // function test(arr, sub) {
  //   sub = sub.toLowerCase();

  //   // return arr.map(str => str
  //   //   .toLowerCase()
  //   //   .endsWith(sub)
  //   // );
  // }

  // const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

  // testArr.filter((e, i, a) => a.indexOf(e) !== i)
  // let maybeDupeArr = [];
  // let indexArr = [];

  // for (let i = 0; i < testArr.length; i++) {
  //   if (testArr[i].includes(" ")) {
  //     maybeDupeArr.push(`${testArr[i].split(" ").pop().trim()}`);
  //   }
  // }

  // // console.log(maybeDupeArr);
  // const dupeArr = [...new Set(maybeDupeArr.filter((e, i, a) => a.indexOf(e) !== i))];

  // // const dupeArr = [...new Set(maybeDupeArr.filter((e, i, a) => {
  // //   if (a.indexOf(e) !== i) {
  // //     indexArr.push(i);
  // //   }
  // //   return a.indexOf(e) !== i
  // // }))];

  // for (let i = 0; i < testArr.length; i++) {
  //   const end = testArr[i].split(" ").pop().trim();
  //   // console.log(end);
  //   if (dupeArr.includes(end)) {
  //     // console.log(i);
  //     indexArr.push(i);
  //   }
  // }
  
  // // unmatchedArr = testArr.some(word => !dupeArr.toLowerCase().includes())

  // for (let i = indexArr.length - 1; i >= 0; i--) {
  //   if (i > -1) {
  //     testArr.splice(indexArr[i], 1);
  //   }
  // }

  // for (let i = 0; i < dupeArr.length; i++) {
  //   testArr.push(`{teamName} ${dupeArr[i]}`);
  // }

  // endArr = [...testArr];
  // console.log(endArr);

  // console.log(dupeArr);
  // console.log(maybeDupeArr);
  // console.log(indexArr);
  // console.log(findDuplicates(endArr)) // All duplicates
  // console.log([...new Set(endArr)]) // Unique duplicates



  // TESTING ZONE
  // for (let i = 0; i < testArr.length; i++) {
  //   if (testArr[i].includes(" ")) {
  //     maybeDupeArr.push(`${testArr[i].split(" ").pop().trim()}`);
  //   }
  // }


  // ORIGINAL IDEA
      // let newSceneList: string[] = [];
    // for (let i = 0; i < sceneList.length; i++) {
    //   if (sceneList[i].name.includes(" ")) {
    //     newSceneList.push(`{teamName} ${sceneList[i].name.split(" ").pop().trim()}`);
    //   }
    //   else {
    //     newSceneList.push(sceneList[i].name);
    //   }
    // }

    // this.scenes = [...new Set(newSceneList)];
    // console.log(this.scenes)

    let scenes = [];

    const parseScenes = (rawSceneList: OBSResponseTypes['GetSceneList']) => {
      let maybeMatchArr: string[] = []; // Stores the string endings after the space
      let indexArr: number[] = []; // Holds the index of where there are matched endings
      let cleanArr: string[] = [];
  
      // The Scene type is explicitly defined rather than using JsonObject
      // @ts-ignore
      const sceneList: Scene[] = rawSceneList.scenes;
      console.log(sceneList)
    
      // Splitting off the string endings to check for matches
      for (let i = 0; i < sceneList.length; i++) {
        if (sceneList[i].sceneName.includes(" ")) {
          maybeMatchArr.push(sceneList[i].sceneName.split(" ").pop().trim());
        }
      }
    
      // Finding the matches in the string array
      //   NOTE: This does not store the first instance of a match
      const dupeArr = [...new Set(maybeMatchArr.filter((e, i, a) => a.indexOf(e) !== i))];
    
      // Looping back through the original array to find all the indexes of matched endings
      for (let i = 0; i < sceneList.length; i++) {
        const end = sceneList[i].sceneName.split(" ").pop().trim();
        if (dupeArr.includes(end)) {
          indexArr.push(i);
        }
      }
    
      // Removing the whole strings where there was a match
      for (let i = indexArr.length - 1; i >= 0; i--) {
        if (i > -1) {
          sceneList.splice(indexArr[i], 1);
        }
      }
  
      // Copying the remaining array to a string typed array
      cleanArr = sceneList.map(scene => scene.sceneName);
    
      // Adding the teamName placeholder
      for (let i = 0; i < dupeArr.length; i++) {
        cleanArr.push(`{teamName} ${dupeArr[i]}`);
      }
    
      // Copying to the stored array
      scenes = [...cleanArr];
    }

  parseScenes(testScenes);

  // const maybeDupeArr = testArr.map((scene) => { 
  //   if (scene.includes(" ")) {
  //     return scene.split(" ").pop().trim();
  // }});

  console.log(scenes);
  
})();