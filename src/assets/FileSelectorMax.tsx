import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./FileSelector.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { Cell, Speaker, Action } from "../hooks/types";

type FileSelector = {
  setFileName: (name: string) => void;
  dispatch: React.Dispatch<Action>;
  speakers: Speaker[];
};

function FileSelector({ setFileName, dispatch, speakers }: FileSelector) {
  function loadFile(acceptedFiles: File[]): void {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        setFileName(file.name);
        file.text().then((t) => {
          const new_contents = read_vtt(t);
          dispatch({
            type: "setContents",
            payload: {
              contents: new_contents,
            },
          });
        });
      };
      reader.readAsArrayBuffer(file);
      return;
    });
  }
  const onDrop = useCallback(loadFile, [setFileName, speakers]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/vtt": [".vtt"] },
  });

  function loadDemo() {
    // TODO this will not work
    setFileName("test_transcript.vtt");
    //const { speakers, contents } = JSON.parse(
    //  '{"speakers":[{"name":"Luke","color":"#369ACC"},{"name":"Obi-Wan","color":"#A83548"},{"name":"C-3PO","color":"#FFC615"},{"name":"R2-D2","color":"#12715D"}],"contents":[{"text":"No, my father didn\'t fight in the wars.","time":"00:04.2","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"He was a navigator on a spice freighter.","time":"00:05.6","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"That\'s what your uncle told you.","time":"00:07.6","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"He didn\'t hold with your father\'s ideals, thought he should have stayed here and not gotten involved.","time":"00:09.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"You fought in the Clone Wars?","time":"00:15.3","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"Yes.","time":"00:17.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"I was once a Jedi Knight, the same as your father.","time":"00:18.2","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"I wish I\'d known him.","time":"00:20.7","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"He was the best star pilot in the galaxy.","time":"00:25.6","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"And a cunning warrior.","time":"00:29.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"I understand you\'ve become quite a good pilot yourself.","time":"00:31.3","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"And he was a good friend.","time":"00:36.2","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Which reminds me, I have something here for you.","time":"00:39.2","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Your father wanted you to have this when you were old enough, but your uncle wouldn\'t allow it.","time":"00:45.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"He feared you might follow old Obi-Wan on some damn fool idealistic crusade like your father did.","time":"00:51.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Sir, if you\'ll not be needing me, I\'ll close down for a while.","time":"00:57.9","ID":2,"speaker":{"name":"C-3PO","color":"#FFC615"}},{"text":"Sure, go ahead.","time":"01:00.3","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"What is it?","time":"01:04.6","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"The father\'s light saber.","time":"01:06.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"This is the weapon of a Jedi Knight.","time":"01:08.8","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Not as clumsy or random as a blaster.","time":"01:11.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"An elegant weapon for a more civilized age.","time":"01:15.4","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"For over a thousand generations, the Jedi Knights were the guardians of peace and justice in the Old Republic.","time":"01:22.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Before the dark times.","time":"01:29.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Before the Empire.","time":"01:32.1","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"How did my father die?","time":"01:36.9","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"A young Jedi named Darth Vader, who was a pupil of mine until he turned to evil, helped the Empire hunt down and destroy the Jedi Knights.","time":"01:41.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"He betrayed and murdered your father.","time":"01:52.1","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Now the Jedi are all but extinct.","time":"01:56.4","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Vader was seduced by the dark side of the Force.","time":"01:59.9","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"The Force?","time":"02:04.5","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"The Force is what gives the Jedi his power.","time":"02:06.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"It\'s an energy field created by all living things.","time":"02:09.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"It surrounds us and penetrates us.","time":"02:12.4","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"It binds the galaxy together.","time":"02:15.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"*Beeps*","time":"","speaker":{"name":"R2-D2","color":"#12715D"},"ID":3}],"copiedCell":null,"prevfocus":27,"newfocus":0}'
    //);
    const { speakers, contents } = JSON.parse(meditations());
    dispatch({
      type: "setState",
      payload: {
        contents: contents,
        speakers: speakers,
      },
    });
    return;
  }

  return (
    <div>
      <div {...getRootProps()} className="FileSelector">
        <FontAwesomeIcon className="fa" icon={faFileLines} />
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop a file here, or click to select file</p>
        )}
      </div>
      <div onClick={loadDemo} className="DemoFile">
        Or, click here to try a demo file!
      </div>
    </div>
  );
}

function time_from_vtt(line_with_time: string) {
  return line_with_time.trim().split(/ --> /g)[0].slice(0, -2); // hh:mm:ss:x
}

function parseSpeaker(line: string) {
  const regex = /^\[SPEAKER_0?(\d+)\]: (.*)$/;
  const match = line.match(regex);
  // If the line matches the pattern, return the speaker ID and the rest of the string
  if (match) {
    const speakerID = Number(match[1]);
    const message = match[2];
    return { speakerID, message };
  } else {
    const speakerID = null;
    const message = line;
    return { speakerID, message };
  }
}

function read_vtt(raw_text: string): Cell[] {
  const lines = raw_text.split(/\r?\n|\r|\n/g); // Split by newline

  if (lines[3].includes("[A")) {
    // Check for newer format where lines 4 is split over two lines, with info about tech used.
    const startIndex = lines[3].indexOf("[A");
    const endIndex = lines[3].indexOf("]", startIndex);
    if (endIndex !== -1) {
      lines[3] = lines[3].substring(0, startIndex) + lines[4];
      lines.splice(4, 1);
    }
  }

  const contents: Cell[] = [];
  let sentence_completed = true;
  for (let i = 2; i < lines.length - 1; i += 3) {
    const { speakerID, message } = parseSpeaker(lines[i + 1]) || {};
    const new_sentences = message
      .replace(/((?<!\bMr|\bMs|\bMrs)[.?!])\s*(?=[A-Z])/g, "$1|")
      .split("|");
    if (!sentence_completed) {
      contents[contents.length - 1].text += " " + new_sentences.shift()?.trim();
    }
    if (new_sentences.length !== 0) {
      contents.push({
        text: new_sentences.shift()?.trim() || "",
        time: time_from_vtt(lines[i]),
        ID: speakerID,
        speaker: null,
      });
    }
    for (const sentence of new_sentences) {
      contents.push({
        text: sentence.trim(),
        time: "",
        ID: speakerID,
        speaker: null,
      });
    }
    sentence_completed =
      null !== contents[contents.length - 1].text.match(/\.|\?|!/g); // If the last sentence contains punctuation, it is completed
  }
  return contents;
}

export default FileSelector;


function meditations() {
  return `{
  "speakers": [
    {
      "name": "Marcus",
      "color": "#369ACC"
    }
  ],
  "contents": [
    {
      "text": "From my grandfather Verus I learned good morals and the government of my temper.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From the reputation and remembrance of my father, modesty and a manly character.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From my mother, piety and beneficence, and abstinence, not only from evil deeds, but even from evil thoughts;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and further, simplicity in my way of living, far removed from the habits of the rich.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From my great-grandfather, not to have frequented public schools, and to have had good teachers at home, and to know that on such things a man should spend liberally.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From my governor, to be neither of the green nor of the blue party at the games in the Circus, nor a partizan either of the Parmularius or the Scutarius at the gladiators' fights;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "from him too I learned endurance of labour, and to want little, and to work with my own hands, and not to meddle with other people's affairs, and not to be ready to listen to slander.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Diognetus, not to busy myself about trifling things, and not to give credit to what was said by miracle-workers and jugglers about incantations and the driving away of daemons and such things;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and not to breed quails for fighting, nor to give myself up passionately to such things;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to endure freedom of speech;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to have become intimate with philosophy;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to have been a hearer, first of Bacchius, then of Tandasis and Marcianus;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to have written dialogues in my youth;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to have desired a plank bed and skin, and whatever else of the kind belongs to the Grecian discipline.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Rusticus I received the impression that my character required improvement and discipline;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and from him I learned not to be led astray to sophistic emulation, nor to writing on speculative matters, nor to delivering little hortatory orations, nor to showing myself off as a man who practises much discipline, or does benevolent acts in order to make a display;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to abstain from rhetoric, and poetry, and fine writing;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and not to walk about in the house in my outdoor dress, nor to do other things of the kind;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to write my letters with simplicity, like the letter which Rusticus wrote from Sinuessa to my mother;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and with respect to those who have offended me by words, or done me wrong, to be easily disposed to be pacified and reconciled, as soon as they have shown a readiness to be reconciled;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to read carefully, and not to be satisfied with a superficial understanding of a book;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor hastily to give my assent to those who talk overmuch;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and I am indebted to him for being acquainted with the discourses of Epictetus, which he communicated to me out of his own collection.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Apollonius I learned freedom of will and undeviating steadiness of purpose;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to look to nothing else, not even for a moment, except to reason;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to be always the same, in sharp pains, on the occasion of the loss of a child, and in long illness;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to see clearly in a living example that the same man can be both most resolute and yielding, and not peevish in giving his instruction;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to have had before my eyes a man who clearly considered his experience and his skill in expounding philosophical principles as the smallest of his merits;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and from him I learned how to receive from friends what are esteemed favours, without being either humbled by them or letting them pass unnoticed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Sextus, a benevolent disposition, and the example of a family governed in a fatherly manner, and the idea of living conformably to nature;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and gravity without affectation, and to look carefully after the interests of friends, and to tolerate ignorant persons, and those who form opinions without consideration: he had the power of readily accommodating himself to all, so that intercourse with him was more agreeable than any flattery;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and at the same time he was most highly venerated by those who associated with him: and he had the faculty both of discovering and ordering, in an intelligent and methodical way, the principles necessary for life;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he never showed anger or any other passion, but was entirely free from passion, and also most affectionate;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he could express approbation without noisy display, and he possessed much knowledge without ostentation.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Alexander the grammarian, to refrain from fault-finding, and not in a reproachful way to chide those who uttered any barbarous or solecistic or strange-sounding expression;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but dexterously to introduce the very expression which ought to have been used, and in the way of answer or giving confirmation, or joining in an inquiry about the thing itself, not about the word, or by some other fit suggestion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Fronto I learned to observe what envy, and duplicity, and hypocrisy are in a tyrant, and that generally those among us who are called Patricians are rather deficient in paternal affection.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Alexander the Platonic, not frequently nor without necessity to say to any one, or to write in a letter, that I have no leisure;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor continually to excuse the neglect of duties required by our relation to those with whom we live, by alleging urgent occupations.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Catulus, not to be indifferent when a friend finds fault, even if he should find fault without reason, but to try to restore him to his usual disposition;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to be ready to speak well of teachers, as it is reported of Domitius and Athenodotus;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to love my children truly.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From my brother Severus, to love my kin, and to love truth, and to love justice;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and through him I learned to know Thrasea, Helvidius, Cato, Dion, Brutus;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and from him I received the idea of a polity in which there is the same law for all, a polity administered with regard to equal rights and equal freedom of speech, and the idea of a kingly government which respects most of all the freedom of the governed;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I learned from him also consistency and undeviating steadiness in my regard for philosophy;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and a disposition to do good, and to give to others readily, and to cherish good hopes, and to believe that I am loved by my friends;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and in him I observed no concealment of his opinions with respect to those whom he condemned, and that his friends had no need to conjecture what he wished or did not wish, but it was quite plain.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Maximus I learned self-government, and not to be led aside by anything;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and cheerfulness in all circumstances, as well as in illness;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and a just admixture in the moral character of sweetness and dignity, and to do what was set before me without complaining.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I observed that everybody believed that he thought as he spoke, and that in all that he did he never had any bad intention;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he never showed amazement and surprise, and was never in a hurry, and never put off doing a thing, nor was perplexed nor dejected, nor did he ever laugh to disguise his vexation, nor, on the other hand, was he ever passionate or suspicious.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He was accustomed to do acts of beneficence, and was ready to forgive, and was free from all falsehood;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he presented the appearance of a man who could not be diverted from right rather than of a man who had been improved.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I observed, too, that no man could ever think that he was despised by Maximus, or ever venture to think himself a better man.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He had also the art of being humorous in an agreeable way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In my father I observed mildness of temper, and unchangeable resolution in the things which he had determined after due deliberation;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and no vainglory in those things which men call honours;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and a love of labour and perseverance;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and a readiness to listen to those who had anything to propose for the common weal;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and undeviating firmness in giving to every man according to his deserts;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and a knowledge derived from experience of the occasions for vigorous action and for remission.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And I observed that he had overcome all passion for boys;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he considered himself no more than any other citizen;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he released his friends from all obligation to sup with him or to attend him of necessity when he went abroad, and those who had failed to accompany him, by reason of any urgent circumstances, always found him the same.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I observed too his habit of careful inquiry in all matters of deliberation, and his persistency, and that he never stopped his investigation through being satisfied with appearances which first present themselves;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that his disposition was to keep his friends, and not to be soon tired of them, nor yet to be extravagant in his affection;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to be satisfied on all occasions, and cheerful;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to foresee things a long way off, and to provide for the smallest without display;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to check immediately popular applause and all flattery;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to be ever watchful over the things which were necessary for the administration of the empire, and to be a good manager of the expenditure, and patiently to endure the blame which he got for such conduct;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he was neither superstitious with respect to the gods, nor did he court men by gifts or by trying to please them, or by flattering the populace;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but he showed sobriety in all things and firmness, and never any mean thoughts or action, nor love of novelty.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And the things which conduce in any way to the commodity of life, and of which fortune gives an abundant supply, he used without arrogance and without excusing himself;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "so that when he had them, he enjoyed them without affectation, and when he had them not, he did not want them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "No one could ever say of him that he was either a sophist or a home-bred flippant slave or a pedant;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but every one acknowledged him to be a man ripe, perfect, above flattery, able to manage his own and other men's affairs.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Besides this, he honoured those who were true philosophers, and he did not reproach those who pretended to be philosophers, nor yet was he easily led by them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He was also easy in conversation, and he made himself agreeable without any offensive affectation.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He took a reasonable care of his body's health, not as one who was greatly attached to life, nor out of regard to personal appearance, nor yet in a careless way, but so that, through his own attention, he very seldom stood in need of the physician's art or of medicine or external applications.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He was most ready to give way without envy to those who possessed any particular faculty, such as that of eloquence or knowledge of the law or of morals, or of anything else;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he gave them his help, that each might enjoy reputation according to his deserts;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he always acted conformably to the institutions of his country, without showing any affectation of doing so.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Further, he was not fond of change nor unsteady, but he loved to stay in the same places, and to employ himself about the same things;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and after his paroxysms of headache he came immediately fresh and vigorous to his usual occupations.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "His secrets were not but very few and very rare, and these only about public matters;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he showed prudence and economy in the exhibition of the public spectacles and the construction of public buildings, his donations to the people, and in such things, for he was a man who looked to what ought to be done, not to the reputation which is got by a man's acts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He did not take the bath at unseasonable hours;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "he was not fond of building houses, nor curious about what he ate, nor about the texture and colour of his clothes, nor about the beauty of his slaves.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "His dress came from Lorium, his villa on the coast, and from Lanuvium generally.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "We know how he behaved to the toll-collector at Tusculum who asked his pardon;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and such was all his behaviour.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "There was in him nothing harsh, nor implacable, nor violent, nor, as one may say, anything carried to the sweating point;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but he examined all things severally, as if he had abundance of time, and without confusion, in an orderly way, vigorously and consistently.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And that might be applied to him which is recorded of Socrates, that he was able both to abstain from, and to enjoy, those things which many are too weak to abstain from, and cannot enjoy without excess.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But to be strong enough both to bear the one and to be sober in the other is the mark of a man who has a perfect and invincible soul, such as he showed in the illness of Maximus.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To the gods I am indebted for having good grandfathers, good parents, a good sister, good teachers, good associates, good kinsmen and friends, nearly everything good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Further, I owe it to the gods that I was not hurried into any offence against any of them, though I had a disposition which, if opportunity had offered, might have led me to do something of this kind;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but, through their favour, there never was such a concurrence of circumstances as put me to the trial.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Further, I am thankful to the gods that I was not longer brought up with my grandfather's concubine, and that I preserved the flower of my youth, and that I did not make proof of my virility before the proper season, but even deferred the time;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that I was subjected to a ruler and a father who was able to take away all pride from me, and to bring me to the knowledge that it is possible for a man to live in a palace without wanting either guards or embroidered dresses, or torches and statues, and such-like show;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but that it is in such a man's power to bring himself very near to the fashion of a private person, without being for this reason either meaner in thought, or more remiss in action, with respect to the things which must be done for the public interest in a manner that befits a ruler.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I thank the gods for giving me such a brother, who was able by his moral character to rouse me to vigilance over myself, and who, at the same time, pleased me by his respect and affection;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that my children have not been stupid nor deformed in body;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that I did not make more proficiency in rhetoric, poetry, and the other studies, in which I should perhaps have been completely engaged, if I had seen that I was making progress in them;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that I made haste to place those who brought me up in the station of honour, which they seemed to desire, without putting them off with hope of my doing it some time after, because they were then still young;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that I knew Apollonius, Rusticus, Maximus;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that I received clear and frequent impressions about living according to nature, and what kind of a life that is, so that, so far as depended on the gods, and their gifts, and help, and inspirations, nothing hindered me from forthwith living according to nature, though I still fall short of it through my own fault, and through not observing the admonitions of the gods, and, I may almost say, their direct instructions;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that my body has held out so long in such a kind of life;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that I never touched either Benedicta or Theodotus, and that, after having fallen into amatory passions, I was cured;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and, though I was often out of humour with Rusticus, I never did anything of which I had occasion to repent;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that, though it was my mother's fate to die young, she spent the last years of her life with me;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that, whenever I wished to help any man in his need, or on any other occasion, I was never told that I had not the means of doing it;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that to myself the same necessity never happened, to receive anything from another;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that I have such a wife, so obedient, and so affectionate, and so simple;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that I had abundance of good masters for my children;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that remedies have been shown to me by dreams, both others, and against bloodspitting and giddiness...;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that, when I had an inclination to philosophy, I did not fall into the hands of any sophist, and that I did not waste my time on writers of histories, or in the resolution of syllogisms, or occupy myself about the investigation of appearances in the heavens;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for all these things require the help of the gods and fortune.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All these things happen to them by reason of their ignorance of what is good and evil.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But I who have seen the nature of the good that it is beautiful, and of the bad that it is ugly, and the nature of him who does wrong, that it is akin to me, not only of the same blood or seed, but that it participates in the same intelligence and the same portion of the divinity, I can neither be injured by any of them, for no one can fix on me what is ugly, nor can I be angry with my kinsman, nor hate him, For we are made for co-operation, like feet, like hands, like eyelids, like the rows of the upper and lower teeth.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To act against one another then is contrary to nature;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and it is acting against one another to be vexed and to turn away.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Whatever this is that I am, it is a little flesh and breath, and the ruling part.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Throw away thy books;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "no longer distract thyself: it is not allowed;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but as if thou wast now dying, despise the flesh;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "it is blood and bones and a network, a contexture of nerves, veins, and arteries.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "See the breath also, what kind of a thing it is, air, and not always the same, but every moment sent out and again sucked in.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The third then is the ruling part: consider thus: Thou art an old man;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "no longer let this be a slave, no longer be pulled by the strings like a puppet to unsocial movements, no longer either be dissatisfied with thy present lot, or shrink from the future.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All that is from the gods is full of Providence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That which is from fortune is not separated from nature or without an interweaving and involution with the things which are ordered by Providence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From thence all things flow;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and there is besides necessity, and that which is for the advantage of the whole universe, of which thou art a part.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But that is good for every part of nature which the nature of the whole brings, and what serves to maintain this nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now the universe is preserved, as by the changes of the elements so by the changes of things compounded of the elements.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let these principles be enough for thee, let them always be fixed opinions.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But cast away the thirst after books, that thou mayest not die murmuring, but cheerfully, truly, and from thy heart thankful to the gods.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Remember how long thou hast been putting off these things, and how often thou hast received an opportunity from the gods, and yet dost not use it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou must now at last perceive of what universe thou art a part, and of what administrator of the universe thy existence is an efflux, and that a limit of time is fixed for thee, which if thou dost not use for clearing away the clouds from thy mind, it will go and thou wilt go, and it will never return.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Every moment think steadily as a Roman and a man to do what thou hast in hand with perfect and simple dignity, and feeling of affection, and freedom, and justice;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to give thyself relief from all other thoughts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And thou wilt give thyself relief, if thou doest every act of thy life as if it were the last, laying aside all carelessness and passionate aversion from the commands of reason, and all hypocrisy, and self-love, and discontent with the portion which has been given to thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou seest how few the things are, the which if a man lays hold of, he is able to live a life which flows in quiet, and is like the existence of the gods;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for the gods on their part will require nothing more from him who observes these things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do wrong to thyself, do wrong to thyself, my soul;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but thou wilt no longer have the opportunity of honouring thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Every man's life is sufficient.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But thine is nearly finished, though thy soul reverences not itself but places thy felicity in the souls of others.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do the things external which fall upon thee distract thee?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Give thyself time to learn something new and good, and cease to be whirled around.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But then thou must also avoid being carried about the other way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For those too are triflers who have wearied themselves in life by their activity, and yet have no object to which to direct every movement, and, in a word, all their thoughts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Through not observing what is in the mind of another a man has seldom been seen to be unhappy;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but those who do not observe the movements of their own minds must of necessity be unhappy.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This thou must always bear in mind, what is the nature of the whole, and what is my nature, and how this is related to that, and what kind of a part it is of what kind of a whole;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that there is no one who hinders thee from always doing and saying the things which are according to the nature of which thou art a part.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Theophrastus, in his comparison of bad acts- such a comparison as one would make in accordance with the common notions of mankind- says, like a true philosopher, that the offences which are committed through desire are more blameable than those which are committed through anger.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For he who is excited by anger seems to turn away from reason with a certain pain and unconscious contraction;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but he who offends through desire, being overpowered by pleasure, seems to be in a manner more intemperate and more womanish in his offences.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Rightly then, and in a way worthy of philosophy, he said that the offence which is committed with pleasure is more blameable than that which is committed with pain;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and on the whole the one is more like a person who has been first wronged and through pain is compelled to be angry;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but the other is moved by his own impulse to do wrong, being carried towards doing something by desire.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Since it is possible that thou mayest depart from life this very moment, regulate every act and thought accordingly.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But to go away from among men, if there are gods, is not a thing to be afraid of, for the gods will not involve thee in evil;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but if indeed they do not exist, or if they have no concern about human affairs, what is it to me to live in a universe devoid of gods or devoid of Providence?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But in truth they do exist, and they do care for human things, and they have put all the means in man's power to enable him not to fall into real evils.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And as to the rest, if there was anything evil, they would have provided for this also, that it should be altogether in a man's power not to fall into it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now that which does not make a man worse, how can it make a man's life worse?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But neither through ignorance, nor having the knowledge, but not the power to guard against or correct these things, is it possible that the nature of the universe has overlooked them;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor is it possible that it has made so great a mistake, either through want of power or want of skill, that good and evil should happen indiscriminately to the good and the bad.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But death certainly, and life, honour and dishonour, pain and pleasure, all these things equally happen to good men and bad, being things which make us neither better nor worse.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Therefore they are neither good nor evil.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How quickly all things disappear, in the universe the bodies themselves, but in time the remembrance of them;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "what is the nature of all sensible things, and particularly those which attract with the bait of pleasure or terrify by pain, or are noised abroad by vapoury fame;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "how worthless, and contemptible, and sordid, and perishable, and dead they are- all this it is the part of the intellectual faculty to observe.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To observe too who these are whose opinions and voices give reputation;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "what death is, and the fact that, if a man looks at it in itself, and by the abstractive power of reflection resolves into their parts all the things which present themselves to the imagination in it, he will then consider it to be nothing else than an operation of nature;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if any one is afraid of an operation of nature, he is a child.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This, however, is not only an operation of nature, but it is also a thing which conduces to the purposes of nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To observe too how man comes near to the deity, and by what part of him, and when this part of man is so disposed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nothing is more wretched than a man who traverses everything in a round, and pries into the things beneath the earth, as the poet says, and seeks by conjecture what is in the minds of his neighbours, without perceiving that it is sufficient to attend to the daemon within him, and to reverence it sincerely.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And reverence of the daemon consists in keeping it pure from passion and thoughtlessness, and dissatisfaction with what comes from gods and men.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the things from the gods merit veneration for their excellence;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the things from men should be dear to us by reason of kinship;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and sometimes even, in a manner, they move our pity by reason of men's ignorance of good and bad;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "this defect being not less than that which deprives us of the power of distinguishing things that are white and black.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Though thou shouldst be going to live three thousand years, and as many times ten thousand years, still remember that no man loses any other life than this which he now lives, nor lives any other than this which he now loses.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The longest and shortest are thus brought to the same.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the present is the same to all, though that which perishes is not the same;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and so that which is lost appears to be a mere moment.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For a man cannot lose either the past or the future: for what a man has not, how can any one take this from him?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "These two things then thou must bear in mind;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "the one, that all things from eternity are of like forms and come round in a circle, and that it makes no difference whether a man shall see the same things during a hundred years or two hundred, or an infinite time;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the second, that the longest liver and he who will die soonest lose just the same.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the present is the only thing of which a man can be deprived, if it is true that this is the only thing which he has, and that a man cannot lose a thing if he has it not.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Remember that all is opinion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what was said by the Cynic Monimus is manifest: and manifest too is the use of what was said, if a man receives what may be got out of it as far as it is true.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The soul of man does violence to itself, first of all, when it becomes an abscess and, as it were, a tumour on the universe, so far as it can.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For to be vexed at anything which happens is a separation of ourselves from nature, in some part of which the natures of all other things are contained.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the next place, the soul does violence to itself when it turns away from any man, or even moves towards him with the intention of injuring, such as are the souls of those who are angry.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the third place, the soul does violence to itself when it is overpowered by pleasure or by pain.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Fourthly, when it plays a part, and does or says anything insincerely and untruly.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Fifthly, when it allows any act of its own and any movement to be without an aim, and does anything thoughtlessly and without considering what it is, it being right that even the smallest things be done with reference to an end;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the end of rational animals is to follow the reason and the law of the most ancient city and polity.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Of human life the time is a point, and the substance is in a flux, and the perception dull, and the composition of the whole body subject to putrefaction, and the soul a whirl, and fortune hard to divine, and fame a thing devoid of judgement.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And, to say all in a word, everything which belongs to the body is a stream, and what belongs to the soul is a dream and vapour, and life is a warfare and a stranger's sojourn, and after-fame is oblivion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then is that which is able to conduct a man?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "One thing and only one, philosophy.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But this consists in keeping the daemon within a man free from violence and unharmed, superior to pains and pleasures, doing nothing without purpose, nor yet falsely and with hypocrisy, not feeling the need of another man's doing or not doing anything;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and besides, accepting all that happens, and all that is allotted, as coming from thence, wherever it is, from whence he himself came;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and, finally, waiting for death with a cheerful mind, as being nothing else than a dissolution of the elements of which every living being is compounded.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if there is no harm to the elements themselves in each continually changing into another, why should a man have any apprehension about the change and dissolution of all the elements?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For it is according to nature, and nothing is evil which is according to nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "We ought to consider not only that our life is daily wasting away and a smaller part of it is left, but another thing also must be taken into the account, that if a man should live longer, it is quite uncertain whether the understanding will still continue sufficient for the comprehension of things, and retain the power of contemplation which strives to acquire the knowledge of the divine and the human.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For if he shall begin to fall into dotage, perspiration and nutrition and imagination and appetite, and whatever else there is of the kind, will not fail;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but the power of making use of ourselves, and filling up the measure of our duty, and clearly separating all appearances, and considering whether a man should now depart from life, and whatever else of the kind absolutely requires a disciplined reason, all this is already extinguished.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "We must make haste then, not only because we are daily nearer to death, but also because the conception of things and the understanding of them cease first.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "We ought to observe also that even the things which follow after the things which are produced according to nature contain something pleasing and attractive.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For instance, when bread is baked some parts are split at the surface, and these parts which thus open, and have a certain fashion contrary to the purpose of the baker's art, are beautiful in a manner, and in a peculiar way excite a desire for eating.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And again, figs, when they are quite ripe, gape open;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and in the ripe olives the very circumstance of their being near to rottenness adds a peculiar beauty to the fruit.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And the ears of corn bending down, and the lion's eyebrows, and the foam which flows from the mouth of wild boars, and many other things- though they are far from being beautiful, if a man should examine them severally- still, because they are consequent upon the things which are formed by nature, help to adorn them, and they please the mind;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "so that if a man should have a feeling and deeper insight with respect to the things which are produced in the universe, there is hardly one of those which follow by way of consequence which will not seem to him to be in a manner disposed so as to give pleasure.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And so he will see even the real gaping jaws of wild beasts with no less pleasure than those which painters and sculptors show by imitation;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and in an old woman and an old man he will be able to see a certain maturity and comeliness;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the attractive loveliness of young persons he will be able to look on with chaste eyes;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and many such things will present themselves, not pleasing to every man, but to him only who has become truly familiar with nature and her works.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Hippocrates after curing many diseases himself fell sick and died.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The Chaldaei foretold the deaths of many, and then fate caught them too.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Alexander, and Pompeius, and Caius Caesar, after so often completely destroying whole cities, and in battle cutting to pieces many ten thousands of cavalry and infantry, themselves too at last departed from life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Heraclitus, after so many speculations on the conflagration of the universe, was filled with water internally and died smeared all over with mud.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And lice destroyed Democritus;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and other lice killed Socrates.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What means all this?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou hast embarked, thou hast made the voyage, thou art come to shore;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "get out.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If indeed to another life, there is no want of gods, not even there.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if to a state without sensation, thou wilt cease to be held by pains and pleasures, and to be a slave to the vessel, which is as much inferior as that which serves it is superior: for the one is intelligence and deity;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "the other is earth and corruption.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not waste the remainder of thy life in thoughts about others, when thou dost not refer thy thoughts to some object of common utility.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thou losest the opportunity of doing something else when thou hast such thoughts as these, What is such a person doing, and why, and what is he saying, and what is he thinking of, and what is he contriving, and whatever else of the kind makes us wander away from the observation of our own ruling power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "We ought then to check in the series of our thoughts everything that is without a purpose and useless, but most of all the over-curious feeling and the malignant;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and a man should use himself to think of those things only about which if one should suddenly ask, What hast thou now in thy thoughts?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "With perfect openness thou mightest, immediately answer, This or That;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "so that from thy words it should be plain that everything in thee is simple and benevolent, and such as befits a social animal, and one that cares not for thoughts about pleasure or sensual enjoyments at all, nor has any rivalry or envy and suspicion, or anything else for which thou wouldst blush if thou shouldst say that thou hadst it in thy mind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the man who is such and no longer delays being among the number of the best, is like a priest and minister of the gods, using too the deity which is planted within him, which makes the man uncontaminated by pleasure, unharmed by any pain, untouched by any insult, feeling no wrong, a fighter in the noblest fight, one who cannot be overpowered by any passion, dyed deep with justice, accepting with all his soul everything which happens and is assigned to him as his portion;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and not often, nor yet without great necessity and for the general interest, imagining what another says, or does, or thinks.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For it is only what belongs to himself that he makes the matter for his activity;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he constantly thinks of that which is allotted to himself out of the sum total of things, and he makes his own acts fair, and he is persuaded that his own portion is good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the lot which is assigned to each man is carried along with him and carries him along with it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And he remembers also that every rational animal is his kinsman, and that to care for all men is according to man's nature;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and a man should hold on to the opinion not of all, but of those only who confessedly live according to nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But as to those who live not so, he always bears in mind what kind of men they are both at home and from home, both by night and by day, and what they are, and with what men they live an impure life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Accordingly, he does not value at all the praise which comes from such men, since they are not even satisfied with themselves.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Labour not unwillingly, nor without regard to the common interest, nor without due consideration, nor with distraction;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor let studied ornament set off thy thoughts, and be not either a man of many words, or busy about too many things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And further, let the deity which is in thee be the guardian of a living being, manly and of ripe age, and engaged in matter political, and a Roman, and a ruler, who has taken his post like a man waiting for the signal which summons him from life, and ready to go, having need neither of oath nor of any man's testimony.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Be cheerful also, and seek not external help nor the tranquility which others give.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A man then must stand erect, not be kept erect by others.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If thou findest in human life anything better than justice, truth, temperance, fortitude, and, in a word, anything better than thy own mind's self-satisfaction in the things which it enables thee to do according to right reason, and in the condition that is assigned to thee without thy own choice;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "if, I say, thou seest anything better than this, turn to it with all thy soul, and enjoy that which thou hast found to be the best.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if nothing appears to be better than the deity which is planted in thee, which has subjected to itself all thy appetites, and carefully examines all the impressions, and, as Socrates said, has detached itself from the persuasions of sense, and has submitted itself to the gods, and cares for mankind;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "if thou findest everything else smaller and of less value than this, give place to nothing else, for if thou dost once diverge and incline to it, thou wilt no longer without distraction be able to give the preference to that good thing which is thy proper possession and thy own;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for it is not right that anything of any other kind, such as praise from the many, or power, or enjoyment of pleasure, should come into competition with that which is rationally and politically or practically good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All these things, even though they may seem to adapt themselves to the better things in a small degree, obtain the superiority all at once, and carry us away.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But do thou, I say, simply and freely choose the better, and hold to it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But that which is useful is the better.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Well then, if it is useful to thee as a rational being, keep to it;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but if it is only useful to thee as an animal, say so, and maintain thy judgement without arrogance: only take care that thou makest the inquiry by a sure method.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Never value anything as profitable to thyself which shall compel thee to break thy promise, to lose thy self-respect, to hate any man, to suspect, to curse, to act the hypocrite, to desire anything which needs walls and curtains: for he who has preferred to everything intelligence and daemon and the worship of its excellence, acts no tragic part, does not groan, will not need either solitude or much company;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and, what is chief of all, he will live without either pursuing or flying from death;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but whether for a longer or a shorter time he shall have the soul inclosed in the body, he cares not at all: for even if he must depart immediately, he will go as readily as if he were going to do anything else which can be done with decency and order;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "taking care of this only all through life, that his thoughts turn not away from anything which belongs to an intelligent animal and a member of a civil community.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the mind of one who is chastened and purified thou wilt find no corrupt matter, nor impurity, nor any sore skinned over.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nor is his life incomplete when fate overtakes him, as one may say of an actor who leaves the stage before ending and finishing the play.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Besides, there is in him nothing servile, nor affected, nor too closely bound to other things, nor yet detached from other things, nothing worthy of blame, nothing which seeks a hiding-place.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Reverence the faculty which produces opinion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "On this faculty it entirely depends whether there shall exist in thy ruling part any opinion inconsistent with nature and the constitution of the rational animal.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And this faculty promises freedom from hasty judgement, and friendship towards men, and obedience to the gods.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Throwing away then all things, hold to these only which are few;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and besides bear in mind that every man lives only this present time, which is an indivisible point, and that all the rest of his life is either past or it is uncertain.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Short then is the time which every man lives, and small the nook of the earth where he lives;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and short too the longest posthumous fame, and even this only continued by a succession of poor human beings, who will very soon die, and who know not even themselves, much less him who died long ago.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To the aids which have been mentioned let this one still be added:- Make for thyself a definition or description of the thing which is presented to thee, so as to see distinctly what kind of a thing it is in its substance, in its nudity, in its complete entirety, and tell thyself its proper name, and the names of the things of which it has been compounded, and into which it will be resolved.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For nothing is so productive of elevation of mind as to be able to examine methodically and truly every object which is presented to thee in life, and always to look at things so as to see at the same time what kind of universe this is, and what kind of use everything performs in it, and what value everything has with reference to the whole, and what with reference to man, who is a citizen of the highest city, of which all other cities are like families;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "what each thing is, and of what it is composed, and how long it is the nature of this thing to endure which now makes an impression on me, and what virtue I have need of with respect to it, such as gentleness, manliness, truth, fidelity, simplicity, contentment, and the rest.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wherefore, on every occasion a man should say: this comes from God;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and this is according to the apportionment and spinning of the thread of destiny, and such-like coincidence and chance;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and this is from one of the same stock, and a kinsman and partner, one who knows not however what is according to his nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But I know;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for this reason I behave towards him according to the natural law of fellowship with benevolence and justice.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "At the same time however in things indifferent I attempt to ascertain the value of each.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If thou workest at that which is before thee, following right reason seriously, vigorously, calmly, without allowing anything else to distract thee, but keeping thy divine part pure, as if thou shouldst be bound to give it back immediately;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "if thou holdest to this, expecting nothing, fearing nothing, but satisfied with thy present activity according to nature, and with heroic truth in every word and sound which thou utterest, thou wilt live happy.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And there is no man who is able to prevent this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "As physicians have always their instruments and knives ready for cases which suddenly require their skill, so do thou have principles ready for the understanding of things divine and human, and for doing everything, even the smallest, with a recollection of the bond which unites the divine and human to one another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For neither wilt thou do anything well which pertains to man without at the same time having a reference to things divine;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor the contrary.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "No longer wander at hazard;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for neither wilt thou read thy own memoirs, nor the acts of the ancient Romans and Hellenes, and the selections from books which thou wast reserving for thy old age.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Hasten then to the end which thou hast before thee, and throwing away idle hopes, come to thy own aid, if thou carest at all for thyself, while it is in thy power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "They know not how many things are signified by the words stealing, sowing, buying, keeping quiet, seeing what ought to be done;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for this is not effected by the eyes, but by another kind of vision.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Body, soul, intelligence: to the body belong sensations, to the soul appetites, to the intelligence principles.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To receive the impressions of forms by means of appearances belongs even to animals;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "to be pulled by the strings of desire belongs both to wild beasts and to men who have made themselves into women, and to a Phalaris and a Nero: and to have the intelligence that guides to the things which appear suitable belongs also to those who do not believe in the gods, and who betray their country, and do their impure deeds when they have shut the doors.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If then everything else is common to all that I have mentioned, there remains that which is peculiar to the good man, to be pleased and content with what happens, and with the thread which is spun for him;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and not to defile the divinity which is planted in his breast, nor disturb it by a crowd of images, but to preserve it tranquil, following it obediently as a god, neither saying anything contrary to the truth, nor doing anything contrary to justice.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And if all men refuse to believe that he lives a simple, modest, and contented life, he is neither angry with any of them, nor does he deviate from the way which leads to the end of life, to which a man ought to come pure, tranquil, ready to depart, and without any compulsion perfectly reconciled to his lot.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That which rules within, when it is according to nature, is so affected with respect to the events which happen, that it always easily adapts itself to that which is and is presented to it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For it requires no definite material, but it moves towards its purpose, under certain conditions however;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and it makes a material for itself out of that which opposes it, as fire lays hold of what falls into it, by which a small light would have been extinguished: but when the fire is strong, it soon appropriates to itself the matter which is heaped on it, and consumes it, and rises higher by means of this very material.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let no act be done without a purpose, nor otherwise than according to the perfect principles of art.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Men seek retreats for themselves, houses in the country, sea-shores, and mountains;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and thou too art wont to desire such things very much.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But this is altogether a mark of the most common sort of men, for it is in thy power whenever thou shalt choose to retire into thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For nowhere either with more quiet or more freedom from trouble does a man retire than into his own soul, particularly when he has within him such thoughts that by looking into them he is immediately in perfect tranquility;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and I affirm that tranquility is nothing else than the good ordering of the mind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Constantly then give to thyself this retreat, and renew thyself;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and let thy principles be brief and fundamental, which, as soon as thou shalt recur to them, will be sufficient to cleanse the soul completely, and to send thee back free from all discontent with the things to which thou returnest.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For with what art thou discontented?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "With the badness of men?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Recall to thy mind this conclusion, that rational animals exist for one another, and that to endure is a part of justice, and that men do wrong involuntarily;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and consider how many already, after mutual enmity, suspicion, hatred, and fighting, have been stretched dead, reduced to ashes;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and be quiet at last.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But perhaps thou art dissatisfied with that which is assigned to thee out of the universe.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Recall to thy recollection this alternative;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "either there is providence or atoms, fortuitous concurrence of things;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or remember the arguments by which it has been proved that the world is a kind of political community, and be quiet at last.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But perhaps corporeal things will still fasten upon thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Consider then further that the mind mingles not with the breath, whether moving gently or violently, when it has once drawn itself apart and discovered its own power, and think also of all that thou hast heard and assented to about pain and pleasure, and be quiet at last.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But perhaps the desire of the thing called fame will torment thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- See how soon everything is forgotten, and look at the chaos of infinite time on each side of the present, and the emptiness of applause, and the changeableness and want of judgement in those who pretend to give praise, and the narrowness of the space within which it is circumscribed, and be quiet at last.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the whole earth is a point, and how small a nook in it is this thy dwelling, and how few are there in it, and what kind of people are they who will praise thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This then remains: Remember to retire into this little territory of thy own, and above all do not distract or strain thyself, but be free, and look at things as a man, as a human being, as a citizen, as a mortal.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But among the things readiest to thy hand to which thou shalt turn, let there be these, which are two.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "One is that things do not touch the soul, for they are external and remain immovable;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but our perturbations come only from the opinion which is within.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The other is that all these things, which thou seest, change immediately and will no longer be;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and constantly bear in mind how many of these changes thou hast already witnessed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The universe is transformation: life is opinion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If our intellectual part is common, the reason also, in respect of which we are rational beings, is common: if this is so, common also is the reason which commands us what to do, and what not to do;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "if this is so, there is a common law also;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "if this is so, we are fellow-citizens;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "if this is so, we are members of some political community;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "if this is so, the world is in a manner a state.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For of what other common political community will any one say that the whole human race are members?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And from thence, from this common political community comes also our very intellectual faculty and reasoning faculty and our capacity for law;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or whence do they come?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For as my earthly part is a portion given to me from certain earth, and that which is watery from another element, and that which is hot and fiery from some peculiar source (for nothing comes out of that which is nothing, as nothing also returns to non-existence), so also the intellectual part comes from some source.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Death is such as generation is, a mystery of nature;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "a composition out of the same elements, and a decomposition into the same;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and altogether not a thing of which any man should be ashamed, for it is not contrary to the nature of a reasonable animal, and not contrary to the reason of our constitution.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is natural that these things should be done by such persons, it is a matter of necessity;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if a man will not have it so, he will not allow the fig-tree to have juice.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But by all means bear this in mind, that within a very short time both thou and he will be dead;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and soon not even your names will be left behind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Take away thy opinion, and then there is taken away the complaint, \\"I have been harmed.\\"",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "\\" Take away the complaint, \\"I have been harmed,\\" and the harm is taken away.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That which does not make a man worse than he was, also does not make his life worse, nor does it harm him either from without or from within.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The nature of that which is universally useful has been compelled to do this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider that everything which happens, happens justly, and if thou observest carefully, thou wilt find it to be so.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I do not say only with respect to the continuity of the series of things, but with respect to what is just, and as if it were done by one who assigns to each thing its value.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Observe then as thou hast begun;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and whatever thou doest, do it in conjunction with this, the being good, and in the sense in which a man is properly understood to be good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Keep to this in every action.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not have such an opinion of things as he has who does thee wrong, or such as he wishes thee to have, but look at them as they are in truth.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A man should always have these two rules in readiness;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "the one, to do only whatever the reason of the ruling and legislating faculty may suggest for the use of men;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "the other, to change thy opinion, if there is any one at hand who sets thee right and moves thee from any opinion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But this change of opinion must proceed only from a certain persuasion, as of what is just or of common advantage, and the like, not because it appears pleasant or brings reputation.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Hast thou reason?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I have.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Why then dost not thou use it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For if this does its own work, what else dost thou wish?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou hast existed as a part.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou shalt disappear in that which produced thee;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but rather thou shalt be received back into its seminal principle by transmutation.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Many grains of frankincense on the same altar: one falls before, another falls after;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but it makes no difference.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Within ten days thou wilt seem a god to those to whom thou art now a beast and an ape, if thou wilt return to thy principles and the worship of reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not act as if thou wert going to live ten thousand years.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Death hangs over thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "While thou livest, while it is in thy power, be good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How much trouble he avoids who does not look to see what his neighbour says or does or thinks, but only to what he does himself, that it may be just and pure;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or as Agathon says, look not round at the depraved morals of others, but run straight along the line without deviating from it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He who has a vehement desire for posthumous fame does not consider that every one of those who remember him will himself also die very soon;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "then again also they who have succeeded them, until the whole remembrance shall have been extinguished as it is transmitted through men who foolishly admire and perish.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But suppose that those who will remember are even immortal, and that the remembrance will be immortal, what then is this to thee?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And I say not what is it to the dead, but what is it to the living?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What is praise except indeed so far as it has a certain utility?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thou now rejectest unseasonably the gift of nature, clinging to something else...",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everything which is in any way beautiful is beautiful in itself, and terminates in itself, not having praise as part of itself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Neither worse then nor better is a thing made by being praised.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I affirm this also of the things which are called beautiful by the vulgar, for example, material things and works of art.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That which is really beautiful has no need of anything;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "not more than law, not more than truth, not more than benevolence or modesty.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Which of these things is beautiful because it is praised, or spoiled by being blamed?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is such a thing as an emerald made worse than it was, if it is not praised?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Or gold, ivory, purple, a lyre, a little knife, a flower, a shrub?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If souls continue to exist, how does the air contain them from eternity?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But how does the earth contain the bodies of those who have been buried from time so remote?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For as here the mutation of these bodies after a certain continuance, whatever it may be, and their dissolution make room for other dead bodies;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "so the souls which are removed into the air after subsisting for some time are transmuted and diffused, and assume a fiery nature by being received into the seminal intelligence of the universe, and in this way make room for the fresh souls which come to dwell there.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And this is the answer which a man might give on the hypothesis of souls continuing to exist.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But we must not only think of the number of bodies which are thus buried, but also of the number of animals which are daily eaten by us and the other animals.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what a number is consumed, and thus in a manner buried in the bodies of those who feed on them!",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And nevertheless this earth receives them by reason of the changes of these bodies into blood, and the transformations into the aerial or the fiery element.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What is the investigation into the truth in this matter?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The division into that which is material and that which is the cause of form, the formal.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not be whirled about, but in every movement have respect to justice, and on the occasion of every impression maintain the faculty of comprehension or understanding.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everything harmonizes with me, which is harmonious to thee, O Universe.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nothing for me is too early nor too late, which is in due time for thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everything is fruit to me which thy seasons bring, O Nature: from thee are all things, in thee are all things, to thee all things return.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The poet says, Dear city of Cecrops;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and wilt not thou say, Dear city of Zeus?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Occupy thyself with few things, says the philosopher, if thou wouldst be tranquil.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But consider if it would not be better to say, Do what is necessary, and whatever the reason of the animal which is naturally social requires, and as it requires.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For this brings not only the tranquility which comes from doing well, but also that which comes from doing few things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the greatest part of what we say and do being unnecessary, if a man takes this away, he will have more leisure and less uneasiness.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Accordingly on every occasion a man should ask himself, Is this one of the unnecessary things?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now a man should take away not only unnecessary acts, but also, unnecessary thoughts, for thus superfluous acts will not follow after.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Try how the life of the good man suits thee, the life of him who is satisfied with his portion out of the whole, and satisfied with his own just acts and benevolent disposition.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Hast thou seen those things?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Look also at these.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not disturb thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Make thyself all simplicity.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Does any one do wrong?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is to himself that he does the wrong.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Has anything happened to thee?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Well;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "out of the universe from the beginning everything which happens has been apportioned and spun out to thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In a word, thy life is short.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou must turn to profit the present by the aid of reason and justice.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Be sober in thy relaxation.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Either it is a well-arranged universe or a chaos huddled together, but still a universe.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But can a certain order subsist in thee, and disorder in the All?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And this too when all things are so separated and diffused and sympathetic.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A black character, a womanish character, a stubborn character, bestial, childish, animal, stupid, counterfeit, scurrilous, fraudulent, tyrannical.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If he is a stranger to the universe who does not know what is in it, no less is he a stranger who does not know what is going on in it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He is a runaway, who flies from social reason;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "he is blind, who shuts the eyes of the understanding;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "he is poor, who has need of another, and has not from himself all things which are useful for life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He is an abscess on the universe who withdraws and separates himself from the reason of our common nature through being displeased with the things which happen, for the same nature produces this, and has produced thee too: he is a piece rent asunder from the state, who tears his own soul from that of reasonable animals, which is one.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The one is a philosopher without a tunic, and the other without a book: here is another half naked: Bread I have not, he says, and I abide by reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- And I do not get the means of living out of my learning, and I abide by my reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Love the art, poor as it may be, which thou hast learned, and be content with it;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and pass through the rest of life like one who has intrusted to the gods with his whole soul all that he has, making thyself neither the tyrant nor the slave of any man.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider, for example, the times of Vespasian.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou wilt see all these things, people marrying, bringing up children, sick, dying, warring, feasting, trafficking, cultivating the ground, flattering, obstinately arrogant, suspecting, plotting, wishing for some to die, grumbling about the present, loving, heaping up treasure, desiring counsulship, kingly power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Well then, that life of these people no longer exists at all.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Again, remove to the times of Trajan.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Again, all is the same.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Their life too is gone.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In like manner view also the other epochs of time and of whole nations, and see how many after great efforts soon fell and were resolved into the elements.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But chiefly thou shouldst think of those whom thou hast thyself known distracting themselves about idle things, neglecting to do what was in accordance with their proper constitution, and to hold firmly to this and to be content with it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And herein it is necessary to remember that the attention given to everything has its proper value and proportion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thus thou wilt not be dissatisfied, if thou appliest thyself to smaller matters no further than is fit.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The words which were formerly familiar are now antiquated: so also the names of those who were famed of old, are now in a manner antiquated, Camillus, Caeso, Volesus, Leonnatus, and a little after also Scipio and Cato, then Augustus, then also Hadrian and Antoninus.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For all things soon pass away and become a mere tale, and complete oblivion soon buries them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And I say this of those who have shone in a wondrous way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the rest, as soon as they have breathed out their breath, they are gone, and no man speaks of them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And, to conclude the matter, what is even an eternal remembrance?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A mere nothing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then is that about which we ought to employ our serious pains?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This one thing, thoughts just, and acts social, and words which never lie, and a disposition which gladly accepts all that happens, as necessary, as usual, as flowing from a principle and source of the same kind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Willingly give thyself up to Clotho, one of the Fates, allowing her to spin thy thread into whatever things she pleases.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everything is only for a day, both that which remembers and that which is remembered.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Observe constantly that all things take place by change, and accustom thyself to consider that the nature of the Universe loves nothing so much as to change the things which are and to make new things like them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For everything that exists is in a manner the seed of that which will be.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But thou art thinking only of seeds which are cast into the earth or into a womb: but this is a very vulgar notion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou wilt soon die, and thou art not yet simple, not free from perturbations, nor without suspicion of being hurt by external things, nor kindly disposed towards all;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor dost thou yet place wisdom only in acting justly.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Examine men's ruling principles, even those of the wise, what kind of things they avoid, and what kind they pursue.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What is evil to thee does not subsist in the ruling principle of another;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor yet in any turning and mutation of thy corporeal covering.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Where is it then?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is in that part of thee in which subsists the power of forming opinions about evils.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let this power then not form such opinions, and all is well.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And if that which is nearest to it, the poor body, is burnt, filled with matter and rottenness, nevertheless let the part which forms opinions about these things be quiet, that is, let it judge that nothing is either bad or good which can happen equally to the bad man and the good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For that which happens equally to him who lives contrary to nature and to him who lives according to nature, is neither according to nature nor contrary to nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Constantly regard the universe as one living being, having one substance and one soul;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and observe how all things have reference to one perception, the perception of this one living being;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how all things act with one movement;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how all things are the cooperating causes of all things which exist;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "observe too the continuous spinning of the thread and the contexture of the web.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou art a little soul bearing about a corpse, as Epictetus used to say.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is no evil for things to undergo change, and no good for things to subsist in consequence of change.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Time is like a river made up of the events which happen, and a violent stream;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for as soon as a thing has been seen, it is carried away, and another comes in its place, and this will be carried away too.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everything which happens is as familiar and well known as the rose in spring and the fruit in summer;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for such is disease, and death, and calumny, and treachery, and whatever else delights fools or vexes them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the series of things those which follow are always aptly fitted to those which have gone before;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for this series is not like a mere enumeration of disjointed things, which has only a necessary sequence, but it is a rational connection: and as all existing things are arranged together harmoniously, so the things which come into existence exhibit no mere succession, but a certain wonderful relationship.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Always remember the saying of Heraclitus, that the death of earth is to become water, and the death of water is to become air, and the death of air is to become fire, and reversely.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And think too of him who forgets whither the way leads, and that men quarrel with that with which they are most constantly in communion, the reason which governs the universe;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the things which daily meet with seem to them strange: and consider that we ought not to act and speak as if we were asleep, for even in sleep we seem to act and speak;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that we ought not, like children who learn from their parents, simply to act and speak as we have been taught.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If any god told thee that thou shalt die to-morrow, or certainly on the day after to-morrow, thou wouldst not care much whether it was on the third day or on the morrow, unless thou wast in the highest degree mean-spirited- for how small is the difference?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- So think it no great thing to die after as many years as thou canst name rather than to-morrow.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Think continually how many physicians are dead after often contracting their eyebrows over the sick;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how many astrologers after predicting with great pretensions the deaths of others;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how many philosophers after endless discourses on death or immortality;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "how many heroes after killing thousands;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how many tyrants who have used their power over men's lives with terrible insolence as if they were immortal;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how many cities are entirely dead, so to speak, Helice and Pompeii and Herculaneum, and others innumerable.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Add to the reckoning all whom thou hast known, one after another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "One man after burying another has been laid out dead, and another buries him: and all this in a short time.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To conclude, always observe how ephemeral and worthless human things are, and what was yesterday a little mucus to-morrow will be a mummy or ashes.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Pass then through this little space of time conformably to nature, and end thy journey in content, just as an olive falls off when it is ripe, blessing nature who produced it, and thanking the tree on which it grew.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Be like the promontory against which the waves continually break, but it stands firm and tames the fury of the water around it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Unhappy am I because this has happened to me.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Not so, but happy am I, though this has happened to me, because I continue free from pain, neither crushed by the present nor fearing the future.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For such a thing as this might have happened to every man;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but every man would not have continued free from pain on such an occasion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why then is that rather a misfortune than this a good fortune?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And dost thou in all cases call that a man's misfortune, which is not a deviation from man's nature?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And does a thing seem to thee to be a deviation from man's nature, when it is not contrary to the will of man's nature?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Well, thou knowest the will of nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Will then this which has happened prevent thee from being just, magnanimous, temperate, prudent, secure against inconsiderate opinions and falsehood;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "will it prevent thee from having modesty, freedom, and everything else, by the presence of which man's nature obtains all that is its own?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Remember too on every occasion which leads thee to vexation to apply this principle: not that this is a misfortune, but that to bear it nobly is good fortune.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is a vulgar, but still a useful help towards contempt of death, to pass in review those who have tenaciously stuck to life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What more then have they gained than those who have died early?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Certainly they lie in their tombs somewhere at last, Cadicianus, Fabius, Julianus, Lepidus, or any one else like them, who have carried out many to be buried, and then were carried out themselves.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Altogether the interval is small between birth and death;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and consider with how much trouble, and in company with what sort of people and in what a feeble body this interval is laboriously passed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not then consider life a thing of any value.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For look to the immensity of time behind thee, and to the time which is before thee, another boundless space.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In this infinity then what is the difference between him who lives three days and him who lives three generations?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Always run to the short way;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the short way is the natural: accordingly say and do everything in conformity with the soundest reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For such a purpose frees a man from trouble, and warfare, and all artifice and ostentatious display.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In he morning when thou risest unwillingly, let this thought be present- I am rising to the work of a human being.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why then am I dissatisfied if I am going to do the things for which I exist and for which I was brought into the world?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Or have I been made for this, to lie in the bed-clothes and keep myself warm?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But this is more pleasant.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Dost thou exist then to take thy pleasure, and not at all for action or exertion?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Dost thou not see the little plants, the little birds, the ants, the spiders, the bees working together to put in order their several parts of the universe?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And art thou unwilling to do the work of a human being, and dost thou not make haste to do that which is according to thy nature?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But it is necessary to take rest also.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- It is necessary: however nature has fixed bounds to this too: she has fixed bounds both to eating and drinking, and yet thou goest beyond these bounds, beyond what is sufficient;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "yet in thy acts it is not so, but thou stoppest short of what thou canst do.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "So thou lovest not thyself, for if thou didst, thou wouldst love thy nature and her will.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But those who love their several arts exhaust themselves in working at them unwashed and without food;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but thou valuest thy own own nature less than the turner values the turning art, or the dancer the dancing art, or the lover of money values his money, or the vainglorious man his little glory.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And such men, when they have a violent affection to a thing, choose neither to eat nor to sleep rather than to perfect the things which they care for.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But are the acts which concern society more vile in thy eyes and less worthy of thy labour?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How easy it is to repel and to wipe away every impression which is troublesome or unsuitable, and immediately to be in all tranquility.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Judge every word and deed which are according to nature to be fit for thee;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and be not diverted by the blame which follows from any people nor by their words, but if a thing is good to be done or said, do not consider it unworthy of thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For those persons have their peculiar leading principle and follow their peculiar movement;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "which things do not thou regard, but go straight on, following thy own nature and the common nature;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the way of both is one.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I go through the things which happen according to nature until I shall fall and rest, breathing out my breath into that element out of which I daily draw it in, and falling upon that earth out of which my father collected the seed, and my mother the blood, and my nurse the milk;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "out of which during so many years I have been supplied with food and drink;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "which bears me when I tread on it and abuse it for so many purposes.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou sayest, Men cannot admire the sharpness of thy wits.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Be it so: but there are many other things of which thou canst not say, I am not formed for them by nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Show those qualities then which are altogether in thy power, sincerity, gravity, endurance of labour, aversion to pleasure, contentment with thy portion and with few things, benevolence, frankness, no love of superfluity, freedom from trifling magnanimity.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Dost thou not see how many qualities thou art immediately able to exhibit, in which there is no excuse of natural incapacity and unfitness, and yet thou still remainest voluntarily below the mark?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Or art thou compelled through being defectively furnished by nature to murmur, and to be stingy, and to flatter, and to find fault with thy poor body, and to try to please men, and to make great display, and to be so restless in thy mind?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "No, by the gods: but thou mightest have been delivered from these things long ago.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Only if in truth thou canst be charged with being rather slow and dull of comprehension, thou must exert thyself about this also, not neglecting it nor yet taking pleasure in thy dulness.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "One man, when he has done a service to another, is ready to set it down to his account as a favour conferred.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Another is not ready to do this, but still in his own mind he thinks of the man as his debtor, and he knows what he has done.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A third in a manner does not even know what he has done, but he is like a vine which has produced grapes, and seeks for nothing more after it has once produced its proper fruit.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "As a horse when he has run, a dog when he has tracked the game, a bee when it has made the honey, so a man when he has done a good act, does not call out for others to come and see, but he goes on to another act, as a vine goes on to produce again the grapes in season.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Must a man then be one of these, who in a manner act thus without observing it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Yes.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But this very thing is necessary, the observation of what a man is doing: for, it may be said, it is characteristic of the social animal to perceive that he is working in a social manner, and indeed to wish that his social partner also should perceive it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- It is true what thou sayest, but thou dost not rightly understand what is now said: and for this reason thou wilt become one of those of whom I spoke before, for even they are misled by a certain show of reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if thou wilt choose to understand the meaning of what is said, do not fear that for this reason thou wilt omit any social act.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A prayer of the Athenians: Rain, rain, O dear Zeus, down on the ploughed fields of the Athenians and on the plains.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- In truth we ought not to pray at all, or we ought to pray in this simple and noble fashion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Just as we must understand when it is said, That Aesculapius prescribed to this man horse-exercise, or bathing in cold water or going without shoes;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "so we must understand it when it is said, That the nature of the universe prescribed to this man disease or mutilation or loss or anything else of the kind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For in the first case Prescribed means something like this: he prescribed this for this man as a thing adapted to procure health;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and in the second case it means: That which happens to (or, suits) every man is fixed in a manner for him suitably to his destiny.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For this is what we mean when we say that things are suitable to us, as the workmen say of squared stones in walls or the pyramids, that they are suitable, when they fit them to one another in some kind of connexion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For there is altogether one fitness, harmony.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And as the universe is made up out of all bodies to be such a body as it is, so out of all existing causes necessity (destiny) is made up to be such a cause as it is.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And even those who are completely ignorant understand what I mean, for they say, It (necessity, destiny) brought this to such a person.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- This then was brought and this was precribed to him.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let us then receive these things, as well as those which Aesculapius prescribes.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Many as a matter of course even among his prescriptions are disagreeable, but we accept them in the hope of health.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let the perfecting and accomplishment of the things, which the common nature judges to be good, be judged by thee to be of the same kind as thy health.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And so accept everything which happens, even if it seem disagreeable, because it leads to this, to the health of the universe and to the prosperity and felicity of Zeus (the universe).",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For he would not have brought on any man what he has brought, if it were not useful for the whole.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Neither does the nature of anything, whatever it may be, cause anything which is not suitable to that which is directed by it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For two reasons then it is right to be content with that which happens to thee;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "the one, because it was done for thee and prescribed for thee, and in a manner had reference to thee, originally from the most ancient causes spun with thy destiny;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the other, because even that which comes severally to every man is to the power which administers the universe a cause of felicity and perfection, nay even of its very continuance.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the integrity of the whole is mutilated, if thou cuttest off anything whatever from the conjunction and the continuity either of the parts or of the causes.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And thou dost cut off, as far as it is in thy power, when thou art dissatisfied, and in a manner triest to put anything out of the way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Be not disgusted, nor discouraged, nor dissatisfied, if thou dost not succeed in doing everything according to right principles;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but when thou bast failed, return back again, and be content if the greater part of what thou doest is consistent with man's nature, and love this to which thou returnest;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and do not return to philosophy as if she were a master, but act like those who have sore eyes and apply a bit of sponge and egg, or as another applies a plaster, or drenching with water.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thus thou wilt not fail to obey reason, and thou wilt repose in it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And remember that philosophy requires only the things which thy nature requires;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but thou wouldst have something else which is not according to nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- It may be objected, Why what is more agreeable than this which I am doing?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But is not this the very reason why pleasure deceives us?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And consider if magnanimity, freedom, simplicity, equanimity, piety, are not more agreeable.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what is more agreeable than wisdom itself, when thou thinkest of the security and the happy course of all things which depend on the faculty of understanding and knowledge?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Things are in such a kind of envelopment that they have seemed to philosophers, not a few nor those common philosophers, altogether unintelligible;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nay even to the Stoics themselves they seem difficult to understand.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And all our assent is changeable;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for where is the man who never changes?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Carry thy thoughts then to the objects themselves, and consider how short-lived they are and worthless, and that they may be in the possession of a filthy wretch or a whore or a robber.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Then turn to the morals of those who live with thee, and it is hardly possible to endure even the most agreeable of them, to say nothing of a man being hardly able to endure himself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In such darkness then and dirt and in so constant a flux both of substance and of time, and of motion and of things moved, what there is worth being highly prized or even an object of serious pursuit, I cannot imagine.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But on the contrary it is a man's duty to comfort himself, and to wait for the   natural dissolution and not to be vexed at the delay, but to rest in these principles only: the one, that nothing will happen to me which is not conformable to the nature of the universe;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the other, that it is in my power never to act contrary to my god and daemon: for there is no man who will compel me to this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "About what am I now employing my own soul?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "On every occasion I must ask myself this question, and inquire, what have I now in this part of me which they call the ruling principle?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And whose soul have I now?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That of a child, or of a young man, or of a feeble woman, or of a tyrant, or of a domestic animal, or of a wild beast?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What kind of things those are which appear good to the many, we may learn even from this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For if any man should conceive certain things as being really good, such as prudence, temperance, justice, fortitude, he would not after having first conceived these endure to listen to anything which should not be in harmony with what is really good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if a man has first conceived as good the things which appear to the many to be good, he will listen and readily receive as very applicable that which was said by the comic writer.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thus even the many perceive the difference.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For were it not so, this saying would not offend and would not be rejected in the first case, while we receive it when it is said of wealth, and of the means which further luxury and fame, as said fitly and wittily.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Go on then and ask if we should value and think those things to be good, to which after their first conception in the mind the words of the comic writer might be aptly applied- that he who has them, through pure abundance has not a place to ease himself in.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I am composed of the formal and the material;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and neither of them will perish into non-existence, as neither of them came into existence out of non-existence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Every part of me then will be reduced by change into some part of the universe, and that again will change into another part of the universe, and so on for ever.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And by consequence of such a change I too exist, and those who begot me, and so on for ever in the other direction.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For nothing hinders us from saying so, even if the universe is administered according to definite periods of revolution.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Reason and the reasoning art (philosophy) are powers which are sufficient for themselves and for their own works.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "They move then from a first principle which is their own, and they make their way to the end which is proposed to them;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and this is the reason why such acts are named catorthoseis or right acts, which word signifies that they proceed by the right road.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "None of these things ought to be called a man's, which do not belong to a man, as man.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "They are not required of a man, nor does man's nature promise them, nor are they the means of man's nature attaining its end.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Neither then does the end of man lie in these things, nor yet that which aids to the accomplishment of this end, and that which aids towards this end is that which is good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Besides, if any of these things did belong to man, it would not be right for a man to despise them and to set himself against them;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor would a man be worthy of praise who showed that he did not want these things, nor would he who stinted himself in any of them be good, if indeed these things were good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But now the more of these things a man deprives himself of, or of other things like them, or even when he is deprived of any of them, the more patiently he endures the loss, just in the same degree he is a better man.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Such as are thy habitual thoughts, such also will be the character of thy mind;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for the soul is dyed by the thoughts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Dye it then with a continuous series of such thoughts as these: for instance, that where a man can live, there he can also live well.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But he must live in a palace;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- well then, he can also live well in a palace.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And again, consider that for whatever purpose each thing has been constituted, for this it has been constituted, and towards this it is carried;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and its end is in that towards which it is carried;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and where the end is, there also is the advantage and the good of each thing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now the good for the reasonable animal is society;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for that we are made for society has been shown above.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is it not plain that the inferior exist for the sake of the superior?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But the things which have life are superior to those which have not life, and of those which have life the superior are those which have reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To seek what is impossible is madness: and it is impossible that the bad should not do something of this kind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nothing happens to any man which he is not formed by nature to bear.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The same things happen to another, and either because he does not see that they have happened or because he would show a great spirit he is firm and remains unharmed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is a shame then that ignorance and conceit should be stronger than wisdom.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Things themselves touch not the soul, not in the least degree;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor have they admission to the soul, nor can they turn or move the soul: but the soul turns and moves itself alone, and whatever judgements it may think proper to make, such it makes for itself the things which present themselves to it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In one respect man is the nearest thing to me, so far as I must do good to men and endure them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But so far as some men make themselves obstacles to my proper acts, man becomes to me one of the things which are indifferent, no less than the sun or wind or a wild beast.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now it is true that these may impede my action, but they are no impediments to my affects and disposition, which have the power of acting conditionally and changing: for the mind converts and changes every hindrance to its activity into an aid;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and so that which is a hindrance is made a furtherance to an act;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that which is an obstacle on the road helps us on this road.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Reverence that which is best in the universe;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and this is that which makes use of all things and directs all things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And in like manner also reverence that which is best in thyself;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and this is of the same kind as that.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For in thyself also, that which makes use of everything else, is this, and thy life is directed by this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That which does no harm to the state, does no harm to the citizen.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the case of every appearance of harm apply this rule: if the state is not harmed by this, neither am I harmed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if the state is harmed, thou must not be angry with him who does harm to the state.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Show him where his error is.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Often think of the rapidity with which things pass by and disappear, both the things which are and the things which are produced.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For substance is like a river in a continual flow, and the activities of things are in constant change, and the causes work in infinite varieties;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and there is hardly anything which stands still.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And consider this which is near to thee, this boundless abyss of the past and of the future in which all things disappear.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How then is he not a fool who is puffed up with such things or plagued about them and makes himself miserable?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for they vex him only for a time, and a short time.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Think of the universal substance, of which thou hast a very small portion;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and of universal time, of which a short and indivisible interval has been assigned to thee;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and of that which is fixed by destiny, and how small a part of it thou art.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Does another do me wrong?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let him look to it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He has his own disposition, his own activity.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I now have what the universal nature wills me to have;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and I do what my nature now wills me to do.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let the part of thy soul which leads and governs be undisturbed by the movements in the flesh, whether of pleasure or of pain;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and let it not unite with them, but let it circumscribe itself and limit those affects to their parts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But when these affects rise up to the mind by virtue of that other sympathy that naturally exists in a body which is all one, then thou must not strive to resist the sensation, for it is natural: but let not the ruling part of itself add to the sensation the opinion that it is either good or bad.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Live with the gods.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And he does live with the gods who constantly shows to them, his own soul is satisfied with that which is assigned to him, and that it does all that the daemon wishes, which Zeus hath given to every man for his guardian and guide, a portion of himself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And this is every man's understanding and reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Art thou angry with him whose armpits stink?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Art thou angry with him whose mouth smells foul?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What good will this danger do thee?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He has such a mouth, he has such arm-pits: it is necessary that such an emanation must come from such things- but the man has reason, it will be said, and he is able, if he takes pain, to discover wherein he offends- I wish thee well of thy discovery.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Well then, and thou hast reason: by thy rational faculty stir up his rational faculty;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "show him his error, admonish him.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For if he listens, thou wilt cure him, and there is no need of anger.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Neither tragic actor nor whore...",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "As thou intendest to live when thou art gone out,...",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "so it is in thy power to live here.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if men do not permit thee, then get away out of life, yet so as if thou wert suffering no harm.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The house is smoky, and I quit it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why dost thou think that this is any trouble?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But so long as nothing of the kind drives me out, I remain, am free, and no man shall hinder me from doing what I choose;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and I choose to do what is according to the nature of the rational and social animal.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The intelligence of the universe is social.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Accordingly it has made the inferior things for the sake of the superior, and it has fitted the superior to one another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou seest how it has subordinated, co-ordinated and assigned to everything its proper portion, and has brought together into concord with one another the things which are the best.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How hast thou behaved hitherto to the gods, thy parents, brethren, children, teachers, to those who looked after thy infancy, to thy friends, kinsfolk, to thy slaves?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider if thou hast hitherto behaved to all in such a way that this may be said of thee:   Never has wronged a man in deed or word.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And call to recollection both how many things thou hast passed through, and how many things thou hast been able to endure: and that the history of thy life is now complete and thy service is ended: and how many beautiful things thou hast seen: and how many pleasures and pains thou hast despised;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how many things called honourable thou hast spurned;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to how many ill-minded folks thou hast shown a kind disposition.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why do unskilled and ignorant souls disturb him who has skill and knowledge?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What soul then has skill and knowledge?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That which knows beginning and end, and knows the reason which pervades all substance and through all time by fixed periods (revolutions) administers the universe.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Soon, very soon, thou wilt be ashes, or a skeleton, and either a name or not even a name;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but name is sound and echo.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And the things which are much valued in life are empty and rotten and trifling, and like little dogs biting one another, and little children quarrelling, laughing, and then straightway weeping.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But fidelity and modesty and justice and truth are fled   Up to Olympus from the wide-spread earth.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then is there which still detains thee here?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If the objects of sense are easily changed and never stand still, and the organs of perception are dull and easily receive false impressions;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the poor soul itself is an exhalation from blood.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But to have good repute amidst such a world as this is an empty thing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why then dost thou not wait in tranquility for thy end, whether it is extinction or removal to another state?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And until that time comes, what is sufficient?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why, what else than to venerate the gods and bless them, and to do good to men, and to practise tolerance and self-restraint;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but as to everything which is beyond the limits of the poor flesh and breath, to remember that this is neither thine nor in thy power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou canst pass thy life in an equable flow of happiness, if thou canst go by the right way, and think and act in the right way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "These two things are common both to the soul of God and to the soul of man, and to the soul of every rational being, not to be hindered by another;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to hold good to consist in the disposition to justice and the practice of it, and in this to let thy desire find its termination.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If this is neither my own badness, nor an effect of my own badness, and the common weal is not injured, why am I troubled about it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And what is the harm to the common weal?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not be carried along inconsiderately by the appearance of things, but give help to all according to thy ability and their fitness;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if they should have sustained loss in matters which are indifferent, do not imagine this to be a damage.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For it is a bad habit.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But as the old man, when he went away, asked back his foster-child's top, remembering that it was a top, so do thou in this case also.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When thou art calling out on the Rostra, hast thou forgotten, man, what these things are?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Yes;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but they are objects of great concern to these people- wilt thou too then be made a fool for these things?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- I was once a fortunate man, but I lost it, I know not how.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But fortunate means that a man has assigned to himself a good fortune: and a good fortune is good disposition of the soul, good emotions, good actions.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The substance of the universe is obedient and compliant;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the reason which governs it has in itself no cause for doing evil, for it has no malice, nor does it do evil to anything, nor is anything harmed by it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But all things are made and perfected according to this reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let it make no difference to thee whether thou art cold or warm, if thou art doing thy duty;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and whether thou art drowsy or satisfied with sleep;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and whether ill-spoken of or praised;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and whether dying or doing something else.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For it is one of the acts of life, this act by which we die: it is sufficient then in this act also to do well what we have in hand.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Look within.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let neither the peculiar quality of anything nor its value escape thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All existing things soon change, and they will either be reduced to vapour, if indeed all substance is one, or they will be dispersed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The reason which governs knows what its own disposition is, and what it does, and on what material it works.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The best way of avenging thyself is not to become like the wrong doer.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Take pleasure in one thing and rest in it, in passing from one social act to another social act, thinking of God.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The ruling principle is that which rouses and turns itself, and while it makes itself such as it is and such as it wills to be, it also makes everything which happens appear to itself to be such as it wills.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In conformity to the nature of the universe every single thing is accomplished, for certainly it is not in conformity to any other nature that each thing is accomplished, either a nature which externally comprehends this, or a nature which is comprehended within this nature, or a nature external and independent of this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The universe is either a confusion, and a mutual involution of things, and a dispersion;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or it is unity and order and providence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If then it is the former, why do I desire to tarry in a fortuitous combination of things and such a disorder?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And why do I care about anything else than how I shall at last become earth?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And why am I disturbed, for the dispersion of my elements will happen whatever I do.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if the other supposition is true, I venerate, and I am firm, and I trust in him who governs.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When thou hast been compelled by circumstances to be disturbed in a manner, quickly return to thyself and do not continue out of tune longer than the compulsion lasts;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for thou wilt have more mastery over the harmony by continually recurring to it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If thou hadst a step-mother and a mother at the same time, thou wouldst be dutiful to thy step-mother, but still thou wouldst constantly return to thy mother.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let the court and philosophy now be to thee step-mother and mother: return to philosophy frequently and repose in her, through whom what thou meetest with in the court appears to thee tolerable, and thou appearest tolerable in the court.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When we have meat before us and such eatables we receive the impression, that this is the dead body of a fish, and this is the dead body of a bird or of a pig;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and again, that this Falernian is only a little grape juice, and this purple robe some sheep's wool dyed with the blood of a shell-fish: such then are these impressions, and they reach the things themselves and penetrate them, and so we see what kind of things they are.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Just in the same way ought we to act all through life, and where there are things which appear most worthy of our approbation, we ought to lay them bare and look at their worthlessness and strip them of all the words by which they are exalted.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For outward show is a wonderful perverter of the reason, and when thou art most sure that thou art employed about things worth thy pains, it is then that it cheats thee most.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider then what Crates says of Xenocrates himself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Most of the things which the multitude admire are referred to objects of the most general kind, those which are held together by cohesion or natural organization, such as stones, wood, fig-trees, vines, olives.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But those which are admired by men who are a little more reasonable are referred to the things which are held together by a living principle, as flocks, herds.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Those which are admired by men who are still more instructed are the things which are held together by a rational soul, not however a universal soul, but rational so far as it is a soul skilled in some art, or expert in some other way, or simply rational so far as it possesses a number of slaves.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But he who values rational soul, a soul universal and fitted for political life, regards nothing else except this;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and above all things he keeps his soul in a condition and in an activity conformable to reason and social life, and he co-operates to this end with those who are of the same kind as himself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Some things are hurrying into existence, and others are hurrying out of it;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and of that which is coming into existence part is already extinguished.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Motions and changes are continually renewing the world, just as the uninterrupted course of time is always renewing the infinite duration of ages.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In this flowing stream then, on which there is no abiding, what is there of the things which hurry by on which a man would set a high price?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It would be just as if a man should fall in love with one of the sparrows which fly by, but it has already passed out of sight.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Something of this kind is the very life of every man, like the exhalation of the blood and the respiration of the air.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For such as it is to have once drawn in the air and to have given it back, which we do every moment, just the same is it with the whole respiratory power, which thou didst receive at thy birth yesterday and the day before, to give it back to the element from which thou didst first draw it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Neither is transpiration, as in plants, a thing to be valued, nor respiration, as in domesticated animals and wild beasts, nor the receiving of impressions by the appearances of things, nor being moved by desires as puppets by strings, nor assembling in herds, nor being nourished by food;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for this is just like the act of separating and parting with the useless part of our food.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then is worth being valued?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To be received with clapping of hands?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "No.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Neither must we value the clapping of tongues, for the praise which comes from the many is a clapping of tongues.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Suppose then that thou hast given up this worthless thing called fame, what remains that is worth valuing?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This in my opinion, to move thyself and to restrain thyself in conformity to thy proper constitution, to which end both all employments and arts lead.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For every art aims at this, that the thing which has been made should be adapted to the work for which it has been made;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and both the vine-planter who looks after the vine, and the horse-breaker, and he who trains the dog, seek this end.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But the education and the teaching of youth aim at something.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In this then is the value of the education and the teaching.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And if this is well, thou wilt not seek anything else.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wilt thou not cease to value many other things too?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Then thou wilt be neither free, nor sufficient for thy own happiness, nor without passion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For of necessity thou must be envious, jealous, and suspicious of those who can take away those things, and plot against those who have that which is valued by thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Of necessity a man must be altogether in a state of perturbation who wants any of these things;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and besides, he must often find fault with the gods.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But to reverence and honour thy own mind will make thee content with thyself, and in harmony with society, and in agreement with the gods, that is, praising all that they give and have ordered.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Above, below, all around are the movements of the elements.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But the motion of virtue is in none of these: it is something more divine, and advancing by a way hardly observed it goes happily on its road.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How strangely men act.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "They will not praise those who are living at the same time and living with themselves;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but to be themselves praised by posterity, by those whom they have never seen or ever will see, this they set much value on.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But this is very much the same as if thou shouldst be grieved because those who have lived before thee did not praise thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If a thing is difficult to be accomplished by thyself, do not think that it is impossible for man: but if anything is possible for man and conformable to his nature, think that this can be attained by thyself too.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the gymnastic exercises suppose that a man has torn thee with his nails, and by dashing against thy head has inflicted a wound.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Well, we neither show any signs of vexation, nor are we offended, nor do we suspect him afterwards as a treacherous fellow;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and yet we are on our guard against him, not however as an enemy, nor yet with suspicion, but we quietly get out of his way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Something like this let thy behaviour be in all the other parts of life;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "let us overlook many things in those who are like antagonists in the gymnasium.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For it is in our power, as I said, to get out of the way, and to have no suspicion nor hatred.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If any man is able to convince me and show me that I do not think or act right, I will gladly change;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for I seek the truth by which no man was ever injured.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But he is injured who abides in his error and ignorance.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I do my duty: other things trouble me not;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for they are either things without life, or things without reason, or things that have rambled and know not the way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "As to the animals which have no reason and generally all things and objects, do thou, since thou hast reason and they have none, make use of them with a generous and liberal spirit.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But towards human beings, as they have reason, behave in a social spirit.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And on all occasions call on the gods, and do not perplex thyself about the length of time in which thou shalt do this;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for even three hours so spent are sufficient.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Alexander the Macedonian and his groom by death were brought to the same state;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for either they were received among the same seminal principles of the universe, or they were alike dispersed among the atoms.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider how many things in the same indivisible time take place in each of us, things which concern the body and things which concern the soul: and so thou wilt not wonder if many more things, or rather all things which come into existence in that which is the one and all, which we call Cosmos, exist in it at the same time.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If any man should propose to thee the question, how the name Antoninus is written, wouldst thou with a straining of the voice utter each letter?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then if they grow angry, wilt thou be angry too?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wilt thou not go on with composure and number every letter?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "just so then in this life also remember that every duty is made up of certain parts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "These it is thy duty to observe and without being disturbed or showing anger towards those who are angry with thee to go on thy way and finish that which is set before thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How cruel it is not to allow men to strive after the things which appear to them to be suitable to their nature and profitable!",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And yet in a manner thou dost not allow them to do this, when thou art vexed because they do wrong.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For they are certainly moved towards things because they suppose them to be suitable to their nature and profitable to them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But it is not so.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Teach them then, and show them without being angry.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Death is a cessation of the impressions through the senses, and of the pulling of the strings which move the appetites, and of the discursive movements of the thoughts, and of the service to the flesh.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is a shame for the soul to be first to give way in this life, when thy body does not give way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Take care that thou art not made into a Caesar, that thou art not dyed with this dye;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for such things happen.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Keep thyself then simple, good, pure, serious, free from affectation, a friend of justice, a worshipper of the gods, kind, affectionate, strenuous in all proper acts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Strive to continue to be such as philosophy wished to make thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Reverence the gods, and help men.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Short is life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "There is only one fruit of this terrene life, a pious disposition and social acts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do everything as a disciple of Antoninus.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Remember his constancy in every act which was conformable to reason, and his evenness in all things, and his piety, and the serenity of his countenance, and his sweetness, and his disregard of empty fame, and his efforts to understand things;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how he would never let anything pass without having first most carefully examined it and clearly understood it;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how he bore with those who blamed him unjustly without blaming them in return;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "how he did nothing in a hurry;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how he listened not to calumnies, and how exact an examiner of manners and actions he was;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and not given to reproach people, nor timid, nor suspicious, nor a sophist;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and with how little he was satisfied, such as lodging, bed, dress, food, servants;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how laborious and patient;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how he was able on account of his sparing diet to hold out to the evening, not even requiring to relieve himself by any evacuations except at the usual hour;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and his firmness and uniformity in his friendships;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how he tolerated freedom of speech in those who opposed his opinions;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the pleasure that he had when any man showed him anything better;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how religious he was without superstition.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Imitate all this that thou mayest have as good a conscience, when thy last hour comes, as he had.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Return to thy sober senses and call thyself back;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and when thou hast roused thyself from sleep and hast perceived that they were only dreams which troubled thee, now in thy waking hours look at these (the things about thee) as thou didst look at those (the dreams).",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I consist of a little body and a soul.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now to this little body all things are indifferent, for it is not able to perceive differences.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But to the understanding those things only are indifferent, which are not the works of its own activity.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But whatever things are the works of its own activity, all these are in its power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And of these however only those which are done with reference to the present;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for as to the future and the past activities of the mind, even these are for the present indifferent.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Neither the labour which the hand does nor that of the foot is contrary to nature, so long as the foot does the foot's work and the hand the hand's.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "So then neither to a man as a man is his labour contrary to nature, so long as it does the things of a man.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if the labour is not contrary to his nature, neither is it an evil to him.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How many pleasures have been enjoyed by robbers, patricides, tyrants.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Dost thou not see how the handicraftsmen accommodate themselves up to a certain point to those who are not skilled in their craft- nevertheless they cling to the reason (the principles) of their art and do not endure to depart from it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is it not strange if the architect and the physician shall have more respect to the reason (the principles) of their own arts than man to his own reason, which is common to him and the gods?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Asia, Europe are corners of the universe: all the sea a drop in the universe;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Athos a little clod of the universe: all the present time is a point in eternity.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All things are little, changeable, perishable.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All things come from thence, from that universal ruling power either directly proceeding or by way of sequence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And accordingly the lion's gaping jaws, and that which is poisonous, and every harmful thing, as a thorn, as mud, are after-products of the grand and beautiful.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not then imagine that they are of another kind from that which thou dost venerate, but form a just opinion of the source of all.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He who has seen present things has seen all, both everything which has taken place from all eternity and everything which will be for time without end;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for all things are of one kin and of one form.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Frequently consider the connexion of all things in the universe and their relation to one another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For in a manner all things are implicated with one another, and all in this way are friendly to one another;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for one thing comes in order after another, and this is by virtue of the active movement and mutual conspiration and the unity of the substance.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Adapt thyself to the things with which thy lot has been cast: and the men among whom thou hast received thy portion, love them, but do it truly, sincerely.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Every instrument, tool, vessel, if it does that for which it has been made, is well, and yet he who made it is not there.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But in the things which are held together by nature there is within and there abides in them the power which made them;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "wherefore the more is it fit to reverence this power, and to think, that, if thou dost live and act according to its will, everything in thee is in conformity to intelligence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And thus also in the universe the things which belong to it are in conformity to intelligence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Whatever of the things which are not within thy power thou shalt suppose to be good for thee or evil, it must of necessity be that, if such a bad thing befall thee or the loss of such a good thing, thou wilt blame the gods, and hate men too, those who are the cause of the misfortune or the loss, or those who are suspected of being likely to be the cause;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and indeed we do much injustice, because we make a difference between these things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if we judge only those things which are in our power to be good or bad, there remains no reason either for finding fault with God or standing in a hostile attitude to man.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "We are all working together to one end, some with knowledge and design, and others without knowing what they do;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "as men also when they are asleep, of whom it is Heraclitus, I think, who says that they are labourers and co-operators in the things which take place in the universe.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But men co-operate after different fashions: and even those co-operate abundantly, who find fault with what happens and those who try to oppose it and to hinder it;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for the universe had need even of such men as these.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It remains then for thee to understand among what kind of workmen thou placest thyself;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for he who rules all things will certainly make a right use of thee, and he will receive thee among some part of the co-operators and of those whose labours conduce to one end.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But be not thou such a part as the mean and ridiculous verse in the play, which Chrysippus speaks of.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Does the sun undertake to do the work of the rain, or Aesculapius the work of the Fruit-bearer (the earth)?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And how is it with respect to each of the stars, are they not different and yet they work together to the same end?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If the gods have determined about me and about the things which must happen to me, they have determined well, for it is not easy even to imagine a deity without forethought;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and as to doing me harm, why should they have any desire towards that?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what advantage would result to them from this or to the whole, which is the special object of their providence?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if they have not determined about me individually, they have certainly determined about the whole at least, and the things which happen by way of sequence in this general arrangement I ought to accept with pleasure and to be content with them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if they determine about nothing- which it is wicked to believe, or if we do believe it, let us neither sacrifice nor pray nor swear by them nor do anything else which we do as if the gods were present and lived with us- but if however the gods determine about none of the things which concern us, I am able to determine about myself, and I can inquire about that which is useful;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that is useful to every man which is conformable to his own constitution and nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But my nature is rational and social;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and my city and country, so far as I am Antoninus, is Rome, but so far as I am a man, it is the world.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The things then which are useful to these cities are alone useful to me.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Whatever happens to every man, this is for the interest of the universal: this might be sufficient.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But further thou wilt observe this also as a general truth, if thou dost observe, that whatever is profitable to any man is profitable also to other men.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But let the word profitable be taken here in the common sense as said of things of the middle kind, neither good nor bad.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "As it happens to thee in the amphitheatre and such places, that the continual sight of the same things and the uniformity make the spectacle wearisome, so it is in the whole of life;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for all things above, below, are the same and from the same.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How long then?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Think continually that all kinds of men and of all kinds of pursuits and of all nations are dead, so that thy thoughts come down even to Philistion and Phoebus and Origanion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now turn thy thoughts to the other kinds of men.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To that place then we must remove, where there are so many great orators, and so many noble philosophers, Heraclitus, Pythagoras, Socrates;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "so many heroes of former days, and so many generals after them, and tyrants;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "besides these, Eudoxus, Hipparchus, Archimedes, and other men of acute natural talents, great minds, lovers of labour, versatile, confident, mockers even of the perishable and ephemeral life of man, as Menippus and such as are like him.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "As to all these consider that they have long been in the dust.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What harm then is this to them;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and what to those whose names are altogether unknown?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "One thing here is worth a great deal, to pass thy life in truth and justice, with a benevolent disposition even to liars and unjust men.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When thou wishest to delight thyself, think of the virtues of those who live with thee;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for instance, the activity of one, and the modesty of another, and the liberality of a third, and some other good quality of a fourth.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For nothing delights so much as the examples of the virtues, when they are exhibited in the morals of those who live with us and present themselves in abundance, as far as is possible.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wherefore we must keep them before us.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou art not dissatisfied, I suppose, because thou weighest only so many litrae and not three hundred.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Be not dissatisfied then that thou must live only so many years and not more;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for as thou art satisfied with the amount of substance which has been assigned to thee, so be content with the time.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let us try to persuade them (men).",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But act even against their will, when the principles of justice lead that way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If however any man by using force stands in thy way, betake thyself to contentment and tranquility, and at the same time employ the hindrance towards the exercise of some other virtue;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and remember that thy attempt was with a reservation, that thou didst not desire to do impossibilities.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then didst thou desire?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Some such effort as this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But thou attainest thy object, if the things to which thou wast moved are accomplished.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He who loves fame considers another man's activity to be his own good;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he who loves pleasure, his own sensations;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but he who has understanding, considers his own acts to be his own good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is in our power to have no opinion about a thing, and not to be disturbed in our soul;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for things themselves have no natural power to form our judgements.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Accustom thyself to attend carefully to what is said by another, and as much as it is possible, be in the speaker's mind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That which is not good for the swarm, neither is it good for the bee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If sailors abused the helmsman or the sick the doctor, would they listen to anybody else;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or how could the helmsman secure the safety of those in the ship or the doctor the health of those whom he attends?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How many together with whom I came into the world are already gone out of it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To the jaundiced honey tastes bitter, and to those bitten by mad dogs water causes fear;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and to little children the ball is a fine thing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why then am I angry?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Dost thou think that a false opinion has less power than the bile in the jaundiced or the poison in him who is bitten by a mad dog?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "No man will hinder thee from living according to the reason of thy own nature: nothing will happen to thee contrary to the reason of the universal nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What kind of people are those whom men wish to please, and for what objects, and by what kind of acts?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How soon will time cover all things, and how many it has covered already.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What is badness?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is that which thou hast often seen.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And on the occasion of everything which happens keep this in mind, that it is that which thou hast often seen.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everywhere up and down thou wilt find the same things, with which the old histories are filled, those of the middle ages and those of our own day;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "with which cities and houses are filled now.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "There is nothing new: all things are both familiar and short-lived.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How can our principles become dead, unless the impressions (thoughts) which correspond to them are extinguished?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But it is in thy power continuously to fan these thoughts into a flame.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I can have that opinion about anything, which I ought to have.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If I can, why am I disturbed?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The things which are external to my mind have no relation at all to my mind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Let this be the state of thy affects, and thou standest erect.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To recover thy life is in thy power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Look at things again as thou didst use to look at them;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for in this consists the recovery of thy life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The idle business of show, plays on the stage, flocks of sheep, herds, exercises with spears, a bone cast to little dogs, a bit of bread into fish-ponds, labourings of ants and burden-carrying, runnings about of frightened little mice, puppets pulled by strings- all alike.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is thy duty then in the midst of such things to show good humour and not a proud air;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "to understand however that every man is worth just so much as the things are worth about which he busies himself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In discourse thou must attend to what is said, and in every movement thou must observe what is doing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And in the one thou shouldst see immediately to what end it refers, but in the other watch carefully what is the thing signified.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is my understanding sufficient for this or not?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If it is sufficient, I use it for the work as an instrument given by the universal nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if it is not sufficient, then either I retire from the work and give way to him who is able to do it better, unless there be some reason why I ought not to do so;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or I do it as well as I can, taking to help me the man who with the aid of my ruling principle can do what is now fit and useful for the general good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For whatsoever either by myself or with another I can do, ought to be directed to this only, to that which is useful and well suited to society.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How many after being celebrated by fame have been given up to oblivion;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how many who have celebrated the fame of others have long been dead.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Be not ashamed to be helped;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for it is thy business to do thy duty like a soldier in the assault on a town.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How then, if being lame thou canst not mount up on the battlements alone, but with the help of another it is possible?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let not future things disturb thee, for thou wilt come to them, if it shall be necessary, having with thee the same reason which now thou usest for present things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All things are implicated with one another, and the bond is holy;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and there is hardly anything unconnected with any other thing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For things have been co-ordinated, and they combine to form the same universe (order).",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For there is one universe made up of all things, and one God who pervades all things, and one substance, and one law, one common reason in all intelligent animals, and one truth;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "if indeed there is also one perfection for all animals which are of the same stock and participate in the same reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everything material soon disappears in the substance of the whole;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and everything formal (causal) is very soon taken back into the universal reason;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the memory of everything is very soon overwhelmed in time.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To the rational animal the same act is according to nature and according to reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Be thou erect, or be made erect.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Just as it is with the members in those bodies which are united in one, so it is with rational beings which exist separate, for they have been constituted for one co-operation.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And the perception of this will be more apparent to thee, if thou often sayest to thyself that I am a member (melos) of the system of rational beings.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if (using the letter r) thou sayest that thou art a part (meros) thou dost not yet love men from thy heart;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "beneficence does not yet delight thee for its own sake;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "thou still doest it barely as a thing of propriety, and not yet as doing good to thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let there fall externally what will on the parts which can feel the effects of this fall.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For those parts which have felt will complain, if they choose.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But I, unless I think that what has happened is an evil, am not injured.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And it is in my power not to think so.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Whatever any one does or says, I must be good, just as if the gold, or the emerald, or the purple were always saying this, Whatever any one does or says, I must be emerald and keep my colour.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The ruling faculty does not disturb itself;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I mean, does not frighten itself or cause itself pain.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if any one else can frighten or pain it, let him do so.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the faculty itself will not by its own opinion turn itself into such ways.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let the body itself take care, if it can, that is suffer nothing, and let it speak, if it suffers.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But the soul itself, that which is subject to fear, to pain, which has completely the power of forming an opinion about these things, will suffer nothing, for it will never deviate into such a judgement.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The leading principle in itself wants nothing, unless it makes a want for itself;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and therefore it is both free from perturbation and unimpeded, if it does not disturb and impede itself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Eudaemonia (happiness) is a good daemon, or a good thing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then art thou doing here, O imagination?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Go away, I entreat thee by the gods, as thou didst come, for I want thee not.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But thou art come according to thy old fashion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I am not angry with thee: only go away.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is any man afraid of change?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why what can take place without change?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then is more pleasing or more suitable to the universal nature?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And canst thou take a bath unless the wood undergoes a change?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And canst thou be nourished, unless the food undergoes a change?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And can anything else that is useful be accomplished without change?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Dost thou not see then that for thyself also to change is just the same, and equally necessary for the universal nature?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Through the universal substance as through a furious torrent all bodies are carried, being by their nature united with and cooperating with the whole, as the parts of our body with one another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How many a Chrysippus, how many a Socrates, how many an Epictetus has time already swallowed up?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And let the same thought occur to thee with reference to every man and thing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "One thing only troubles me, lest I should do something which the constitution of man does not allow, or in the way which it does not allow, or what it does not allow now.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Near is thy forgetfulness of all things;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and near the forgetfulness of thee by all.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is peculiar to man to love even those who do wrong.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And this happens, if when they do wrong it occurs to thee that they are kinsmen, and that they do wrong through ignorance and unintentionally, and that soon both of you will die;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and above all, that the wrong-doer has done thee no harm, for he has not made thy ruling faculty worse than it was before.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The universal nature out of the universal substance, as if it were wax, now moulds a horse, and when it has broken this up, it uses the material for a tree, then for a man, then for something else;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and each of these things subsists for a very short time.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But it is no hardship for the vessel to be broken up, just as there was none in its being fastened together.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A scowling look is altogether unnatural;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "when it is often assumed, the result is that all comeliness dies away, and at last is so completely extinguished that it cannot be again lighted up at all.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Try to conclude from this very fact that it is contrary to reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For if even the perception of doing wrong shall depart, what reason is there for living any longer?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nature which governs the whole will soon change all things which thou seest, and out of their substance will make other things, and again other things from the substance of them, in order that the world may be ever new.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When a man has done thee any wrong, immediately consider with what opinion about good or evil he has done wrong.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For when thou hast seen this, thou wilt pity him, and wilt neither wonder nor be angry.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For either thou thyself thinkest the same thing to be good that he does or another thing of the same kind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is thy duty then to pardon him.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if thou dost not think such things to be good or evil, thou wilt more readily be well disposed to him who is in error.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Think not so much of what thou hast not as of what thou hast: but of the things which thou hast select the best, and then reflect how eagerly they would have been sought, if thou hadst them not.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "At the same time however take care that thou dost not through being so pleased with them accustom thyself to overvalue them, so as to be disturbed if ever thou shouldst not have them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Retire into thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The rational principle which rules has this nature, that it is content with itself when it does what is just, and so secures tranquility.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wipe out the imagination.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Stop the pulling of the strings.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Confine thyself to the present.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Understand well what happens either to thee or to another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Divide and distribute every object into the causal (formal) and the material.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Think of thy last hour.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let the wrong which is done by a man stay there where the wrong was done.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Direct thy attention to what is said.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let thy understanding enter into the things that are doing and the things which do them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Adorn thyself with simplicity and modesty and with indifference towards the things which lie between virtue and vice.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Love mankind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Follow God.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The poet says that Law rules all.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- And it is enough to remember that Law rules all.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "About death: Whether it is a dispersion, or a resolution into atoms, or annihilation, it is either extinction or change.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "About pain: The pain which is intolerable carries us off;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but that which lasts a long time is tolerable;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the mind maintains its own tranquility by retiring into itself, and the ruling faculty is not made worse.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But the parts which are harmed by pain, let them, if they can, give their opinion about it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "About fame: Look at the minds of those who seek fame, observe what they are, and what kind of things they avoid, and what kind of things they pursue.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And consider that as the heaps of sand piled on one another hide the former sands, so in life the events which go before are soon covered by those which come after.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Plato: The man who has an elevated mind and takes a view of all time and of all substance, dost thou suppose it possible for him to think that human life is anything great?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "it is not possible, he said.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Such a man then will think that death also is no evil.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Certainly not.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Antisthenes: It is royal to do good and to be abused.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is a base thing for the countenance to be obedient and to regulate and compose itself as the mind commands, and for the mind not to be regulated and composed by itself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is not right to vex ourselves at things,  For they care nought about it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To the immortal gods and us give joy.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Life must be reaped like the ripe ears of corn:  One man is born;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "another dies.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If gods care not for me and for my children,  There is a reason for it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the good is with me, and the just.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "No joining others in their wailing, no violent emotion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "From Plato: But I would make this man a sufficient answer, which is this: Thou sayest not well, if thou thinkest that a man who is good for anything at all ought to compute the hazard of life or death, and should not rather look to this only in all that he does, whether he is doing what is just or unjust, and the works of a good or a bad man.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thus it is, men of Athens, in truth: wherever a man has placed himself thinking it the best place for him, or has been placed by a commander, there in my opinion he ought to stay and to abide the hazard, taking nothing into the reckoning, either death or anything else, before the baseness of deserting his post.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But, my good friend, reflect whether that which is noble and good is not something different from saving and being saved;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for as to a man living such or such a time, at least one who is really a man, consider if this is not a thing to be dismissed from the thoughts: and there must be no love of life: but as to these matters a man must intrust them to the deity and believe what the women say, that no man can escape his destiny, the next inquiry being how he may best live the time that he has to live.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Look round at the courses of the stars, as if thou wert going along with them;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and constantly consider the changes of the elements into one another;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for such thoughts purge away the filth of the terrene life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This is a fine saying of Plato: That he who is discoursing about men should look also at earthly things as if he viewed them from some higher place;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "should look at them in their assemblies, armies, agricultural labours, marriages, treaties, births, deaths, noise of the courts of justice, desert places, various nations of barbarians, feasts, lamentations, markets, a mixture of all things and an orderly combination of contraries.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider the past;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "such great changes of political supremacies.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou mayest foresee also the things which will be.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For they will certainly be of like form, and it is not possible that they should deviate from the order of the things which take place now: accordingly to have contemplated human life for forty years is the same as to have contemplated it for ten thousand years.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what more wilt thou see?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That which has grown from the earth to the earth,  But that which has sprung from heavenly seed,  Back to the heavenly realms returns.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This is either a dissolution of the mutual involution of the atoms, or a similar dispersion of the unsentient elements.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "With food and drinks and cunning magic arts  Turning the channel's course to 'scape from death.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The breeze which heaven has sent  We must endure, and toil without complaining.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Another may be more expert in casting his opponent;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but he is not more social, nor more modest, nor better disciplined to meet all that happens, nor more considerate with respect to the faults of his neighbours.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Where any work can be done conformably to the reason which is common to gods and men, there we have nothing to fear: for where we are able to get profit by means of the activity which is successful and proceeds according to our constitution, there no harm is to be suspected.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everywhere and at all times it is in thy power piously to acquiesce in thy present condition, and to behave justly to those who are about thee, and to exert thy skill upon thy present thoughts, that nothing shall steal into them without being well examined.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not look around thee to discover other men's ruling principles, but look straight to this, to what nature leads thee, both the universal nature through the things which happen to thee, and thy own nature through the acts which must be done by thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But every being ought to do that which is according to its constitution;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and all other things have been constituted for the sake of rational beings, just as among irrational things the inferior for the sake of the superior, but the rational for the sake of one another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The prime principle then in man's constitution is the social.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And the second is not to yield to the persuasions of the body, for it is the peculiar office of the rational and intelligent motion to circumscribe itself, and never to be overpowered either by the motion of the senses or of the appetites, for both are animal;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but the intelligent motion claims superiority and does not permit itself to be overpowered by the others.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And with good reason, for it is formed by nature to use all of them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The third thing in the rational constitution is freedom from error and from deception.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let then the ruling principle holding fast to these things go straight on, and it has what is its own.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider thyself to be dead, and to have completed thy life up to the present time;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and live according to nature the remainder which is allowed thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Love that only which happens to thee and is spun with the thread of thy destiny.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what is more suitable?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In everything which happens keep before thy eyes those to whom the same things happened, and how they were vexed, and treated them as strange things, and found fault with them: and now where are they?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nowhere.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why then dost thou too choose to act in the same way?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And why dost thou not leave these agitations which are foreign to nature, to those who cause them and those who are moved by them?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And why art thou not altogether intent upon the right way of making use of the things which happen to thee?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For then thou wilt use them well, and they will be a material for thee to work on.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Only attend to thyself, and resolve to be a good man in every act which thou doest: and remember...",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Look within.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Within is the fountain of good, and it will ever bubble up, if thou wilt ever dig.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The body ought to be compact, and to show no irregularity either in motion or attitude.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what the mind shows in the face by maintaining in it the expression of intelligence and propriety, that ought to be required also in the whole body.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But all of these things should be observed without affectation.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The art of life is more like the wrestler's art than the dancer's, in respect of this, that it should stand ready and firm to meet onsets which are sudden and unexpected.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Constantly observe who those are whose approbation thou wishest to have, and what ruling principles they possess.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For then thou wilt neither blame those who offend involuntarily, nor wilt thou want their approbation, if thou lookest to the sources of their opinions and appetites.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Every soul, the philosopher says, is involuntarily deprived of truth;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "consequently in the same way it is deprived of justice and temperance and benevolence and everything of the kind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is most necessary to bear this constantly in mind, for thus thou wilt be more gentle towards all.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In every pain let this thought be present, that there is no dishonour in it, nor does it make the governing intelligence worse, for it does not damage the intelligence either so far as the intelligence is rational or so far as it is social.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Indeed in the case of most pains let this remark of Epicurus aid thee, that pain is neither intolerable nor everlasting, if thou bearest in mind that it has its limits, and if thou addest nothing to it in imagination: and remember this too, that we do not perceive that many things which are disagreeable to us are the same as pain, such as excessive drowsiness, and the being scorched by heat, and the having no appetite.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When then thou art discontented about any of these things, say to thyself, that thou art yielding to pain.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Take care not to feel towards the inhuman, as they feel towards men.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How do we know if Telauges was not superior in character to Socrates?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For it is not enough that Socrates died a more noble death, and disputed more skilfully with the sophists, and passed the night in the cold with more endurance, and that when he was bid to arrest Leon of Salamis, he considered it more noble to refuse, and that he walked in a swaggering way in the streets- though as to this fact one may have great doubts if it was true.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But we ought to inquire, what kind of a soul it was that Socrates possessed, and if he was able to be content with being just towards men and pious towards the gods, neither idly vexed on account of men's villainy, nor yet making himself a slave to any man's ignorance, nor receiving as strange anything that fell to his share out of the universal, nor enduring it as intolerable, nor allowing his understanding to sympathize with the affects of the miserable flesh.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nature has not so mingled the intelligence with the composition of the body, as not to have allowed thee the power of circumscribing thyself and of bringing under subjection to thyself all that is thy own;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for it is very possible to be a divine man and to be recognised as such by no one.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Always bear this in mind;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and another thing too, that very little indeed is necessary for living a happy life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And because thou hast despaired of becoming a dialectician and skilled in the knowledge of nature, do not for this reason renounce the hope of being both free and modest and social and obedient to God.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is in thy power to live free from all compulsion in the greatest tranquility of mind, even if all the world cry out against thee as much as they choose, and even if wild beasts tear in pieces the members of this kneaded matter which has grown around thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what hinders the mind in the midst of all this from maintaining itself in tranquility and in a just judgement of all surrounding things and in a ready use of the objects which are presented to it, so that the judgement may say to the thing which falls under its observation: This thou art in substance (reality), though in men's opinion thou mayest appear to be of a different kind;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the use shall say to that which falls under the hand: Thou art the thing that I was seeking;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for to me that which presents itself is always a material for virtue both rational and political, and in a word, for the exercise of art, which belongs to man or God.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For everything which happens has a relationship either to God or man, and is neither new nor difficult to handle, but usual and apt matter to work on.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The perfection of moral character consists in this, in passing every day as the last, and in being neither violently excited nor torpid nor playing the hypocrite.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The gods who are immortal are not vexed because during so long a time they must tolerate continually men such as they are and so many of them bad;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and besides this, they also take care of them in all ways.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But thou, who art destined to end so soon, art thou wearied of enduring the bad, and this too when thou art one of them?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is a ridiculous thing for a man not to fly from his own badness, which is indeed possible, but to fly from other men's badness, which is impossible.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Whatever the rational and political (social) faculty finds to be neither intelligent nor social, it properly judges to be inferior to itself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When thou hast done a good act and another has received it, why dost thou look for a third thing besides these, as fools do, either to have the reputation of having done a good act or to obtain a return?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "No man is tired of receiving what is useful.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But it is useful to act according to nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not then be tired of receiving what is useful by doing it to others.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The nature of the An moved to make the universe.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But now either everything that takes place comes by way of consequence or continuity;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or even the chief things towards which the ruling power of the universe directs its own movement are governed by no rational principle.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If this is remembered it will make thee more tranquil in many things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This reflection also tends to the removal of the desire of empty fame, that it is no longer in thy power to have lived the whole of thy life, or at least thy life from thy youth upwards, like a philosopher;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but both to many others and to thyself it is plain that thou art far from philosophy.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou hast fallen into disorder then, so that it is no longer easy for thee to get the reputation of a philosopher;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and thy plan of life also opposes it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If then thou hast truly seen where the matter lies, throw away the thought, How thou shalt seem to others, and be content if thou shalt live the rest of thy life in such wise as thy nature wills.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Observe then what it wills, and let nothing else distract thee;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for thou hast had experience of many wanderings without having found happiness anywhere, not in syllogisms, nor in wealth, nor in reputation, nor in enjoyment, nor anywhere.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Where is it then?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In doing what man's nature requires.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How then shall a man do this?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If he has principles from which come his affects and his acts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What principles?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Those which relate to good and bad: the belief that there is nothing good for man, which does not make him just, temperate, manly, free;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that there is nothing bad, which does not do the contrary to what has been mentioned.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "On the occasion of every act ask thyself, How is this with respect to me?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Shall I repent of it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A little time and I am dead, and all is gone.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What more do I seek, if what I am now doing is work of an intelligent living being, and a social being, and one who is under the same law with God?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Alexander and Gaius and Pompeius, what are they in comparison with Diogenes and Heraclitus and Socrates?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For they were acquainted with things, and their causes (forms), and their matter, and the ruling principles of these men were the same.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But as to the others, how many things had they to care for, and to how many things were they slaves?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider that men will do the same things nevertheless, even though thou shouldst burst.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This is the chief thing: Be not perturbed, for all things are according to the nature of the universal;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and in a little time thou wilt be nobody and nowhere, like Hadrian and Augustus.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the next place having fixed thy eyes steadily on thy business look at it, and at the same time remembering that it is thy duty to be a good man, and what man's nature demands, do that without turning aside;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and speak as it seems to thee most just, only let it be with a good disposition and with modesty and without hypocrisy.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The nature of the universal has this work to do, to remove to that place the things which are in this, to change them, to take them away hence, and to carry them there.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All things are change, yet we need not fear anything new.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All things are familiar to us;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but the distribution of them still remains the same.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Every nature is contented with itself when it goes on its way well;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and a rational nature goes on its way well, when in its thoughts it assents to nothing false or uncertain, and when it directs its movements to social acts only, and when it confines its desires and aversions to the things which are in its power, and when it is satisfied with everything that is assigned to it by the common nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For of this common nature every particular nature is a part, as the nature of the leaf is a part of the nature of the plant;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "except that in the plant the nature of the leaf is part of a nature which has not perception or reason, and is subject to be impeded;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but the nature of man is part of a nature which is not subject to impediments, and is intelligent and just, since it gives to everything in equal portions and according to its worth, times, substance, cause (form), activity, and incident.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But examine, not to discover that any one thing compared with any other single thing is equal in all respects, but by taking all the parts together of one thing and comparing them with all the parts together of another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou hast not leisure or ability to read.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But thou hast leisure or ability to check arrogance: thou hast leisure to be superior to pleasure and pain: thou hast leisure to be superior to love of fame, and not to be vexed at stupid and ungrateful people, nay even to care for them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let no man any longer hear thee finding fault with the court life or with thy own.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Repentance is a kind of self-reproof for having neglected something useful;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but that which is good must be something useful, and the perfect good man should look after it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But no such man would ever repent of having refused any sensual pleasure.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Pleasure then is neither good nor useful.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This thing, what is it in itself, in its own constitution?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What is its substance and material?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And what its causal nature (or form)?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And what is it doing in the world?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And how long does it subsist?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When thou risest from sleep with reluctance, remember that it is according to thy constitution and according to human nature to perform social acts, but sleeping is common also to irrational animals.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But that which is according to each individual's nature is also more peculiarly its own, and more suitable to its nature, and indeed also more agreeable.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Constantly and, if it be possible, on the occasion of every impression on the soul, apply to it the principles of Physic, of Ethic, and of Dialectic.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Whatever man thou meetest with, immediately say to thyself: What opinions has this man about good and bad?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For if with respect to pleasure and pain and the causes of each, and with respect to fame and ignominy, death and life, he has such and such opinions, it will seem nothing wonderful or strange to me, if he does such and such things;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and I shall bear in mind that he is compelled to do so.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Remember that as it is a shame to be surprised if the fig-tree produces figs, so it is to be surprised if the world produces such and such things of which it is productive;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and for the physician and the helmsman it is a shame to be surprised, if a man has a fever, or if the wind is unfavourable.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Remember that to change thy opinion and to follow him who corrects thy error is as consistent with freedom as it is to persist in thy error.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For it is thy own, the activity which is exerted according to thy own movement and judgement, and indeed according to thy own understanding too.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If a thing is in thy own power, why dost thou do it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if it is in the power of another, whom dost thou blame?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The atoms (chance) or the gods?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Both are foolish.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou must blame nobody.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For if thou canst, correct that which is the cause;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but if thou canst not do this, correct at least the thing itself;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but if thou canst not do even this, of what use is it to thee to find fault?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For nothing should be done without a purpose.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That which has died falls not out of the universe.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If it stays here, it also changes here, and is dissolved into its proper parts, which are elements of the universe and of thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And these too change, and they murmur not.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everything exists for some end, a horse, a vine.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why dost thou wonder?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Even the sun will say, I am for some purpose, and the rest of the gods will say the same.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what purpose then art thou?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "to enjoy pleasure?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "See if common sense allows this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nature has had regard in everything no less to the end than to the beginning and the continuance, just like the man who throws up a ball.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What good is it then for the ball to be thrown up, or harm for it to come down, or even to have fallen?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And what good is it to the bubble while it holds together, or what harm when it is burst?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The same may be said of a light also.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Turn it (the body) inside out, and see what kind of thing it is;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and when it has grown old, what kind of thing it becomes, and when it is diseased.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Short-lived are both the praiser and the praised, and the rememberer and the remembered: and all this in a nook of this part of the world;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and not even here do all agree, no, not any one with himself: and the whole earth too is a point.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Attend to the matter which is before thee, whether it is an opinion or an act or a word.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou sufferest this justly: for thou choosest rather to become good to-morrow than to be good to-day.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Am I doing anything?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I do it with reference to the good of mankind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Does anything happen to me?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I receive it and refer it to the gods, and the source of all things, from which all that happens is derived.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Such as bathing appears to thee- oil, sweat, dirt, filthy water, all things disgusting- so is every part of life and everything.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Lucilla saw Verus die, and then Lucilla died.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Secunda saw Maximus die, and then Secunda died.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Epitynchanus saw Diotimus die, and Epitynchanus died.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Antoninus saw Faustina die, and then Antoninus died.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Such is everything.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Celer saw Hadrian die, and then Celer died.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And those sharp-witted men, either seers or men inflated with pride, where are they?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For instance the sharp-witted men, Charax and Demetrius the Platonist and Eudaemon, and any one else like them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All ephemeral, dead long ago.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Some indeed have not been remembered even for a short time, and others have become the heroes of fables, and again others have disappeared even from fables.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Remember this then, that this little compound, thyself, must either be dissolved, or thy poor breath must be extinguished, or be removed and placed elsewhere.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is satisfaction to a man to do the proper works of a man.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now it is a proper work of a man to be benevolent to his own kind, to despise the movements of the senses, to form a just judgement of plausible appearances, and to take a survey of the nature of the universe and of the things which happen in it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "There are three relations between thee and other things: the one to the body which surrounds thee;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "the second to the divine cause from which all things come to all;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the third to those who live with thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Pain is either an evil to the body- then let the body say what it thinks of it- or to the soul;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but it is in the power of the soul to maintain its own serenity and tranquility, and not to think that pain is an evil.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For every judgement and movement and desire and aversion is within, and no evil ascends so high.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wipe out thy imaginations by often saying to thyself: now it is in my power to let no badness be in this soul, nor desire nor any perturbation at all;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but looking at all things I see what is their nature, and I use each according to its value.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Remember this power which thou hast from nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Speak both in the senate and to every man, whoever he may be, appropriately, not with any affectation: use plain discourse.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Augustus' court, wife, daughter, descendants, ancestors, sister, Agrippa, kinsmen, intimates, friends, Areius, Maecenas, physicians and sacrificing priests- the whole court is dead.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Then turn to the rest, not considering the death of a single man, but of a whole race, as of the Pompeii;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that which is inscribed on the tombs- The last of his race.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Then consider what trouble those before them have had that they might leave a successor;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and then, that of necessity some one must be the last.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Again here consider the death of a whole race.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is thy duty to order thy life well in every single act;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if every act does its duty, as far as is possible, be content;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and no one is able to hinder thee so that each act shall not do its duty.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But something external will stand in the way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Nothing will stand in the way of thy acting justly and soberly and considerately.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But perhaps some other active power will be hindered.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Well, but by acquiescing in the hindrance and by being content to transfer thy efforts to that which is allowed, another opportunity of action is immediately put before thee in place of that which was hindered, and one which will adapt itself to this ordering of which we are speaking.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Receive wealth or prosperity without arrogance;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and be ready to let it go.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If thou didst ever see a hand cut off, or a foot, or a head, lying anywhere apart from the rest of the body, such does a man make himself, as far as he can, who is not content with what happens, and separates himself from others, or does anything unsocial.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Suppose that thou hast detached thyself from the natural unity- for thou wast made by nature a part, but now thou hast cut thyself off- yet here there is this beautiful provision, that it is in thy power again to unite thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "God has allowed this to no other part, after it has been separated and cut asunder, to come together again.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But consider the kindness by which he has distinguished man, for he has put it in his power not to be separated at all from the universal;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and when he has been separated, he has allowed him to return and to be united and to resume his place as a part.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "As the nature of the universal has given to every rational being all the other powers that it has, so we have received from it this power also.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For as the universal nature converts and fixes in its predestined place everything which stands in the way and opposes it, and makes such things a part of itself, so also the rational animal is able to make every hindrance its own material, and to use it for such purposes as it may have designed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not disturb thyself by thinking of the whole of thy life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let not thy thoughts at once embrace all the various troubles which thou mayest expect to befall thee: but on every occasion ask thyself, What is there in this which is intolerable and past bearing?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thou wilt be ashamed to confess.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the next place remember that neither the future nor the past pains thee, but only the present.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But this is reduced to a very little, if thou only circumscribest it, and chidest thy mind, if it is unable to hold out against even this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Does Panthea or Pergamus now sit by the tomb of Verus?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Does Chaurias or Diotimus sit by the tomb of Hadrian?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That would be ridiculous.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Well, suppose they did sit there, would the dead be conscious of it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And if the dead were conscious, would they be pleased?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And if they were pleased, would that make them immortal?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Was it not in the order of destiny that these persons too should first become old women and old men and then die?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then would those do after these were dead?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All this is foul smell and blood in a bag.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If thou canst see sharp, look and judge wisely, says the philosopher.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the constitution of the rational animal I see no virtue which is opposed to justice;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but I see a virtue which is opposed to love of pleasure, and that is temperance.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If thou takest away thy opinion about that which appears to give thee pain, thou thyself standest in perfect security.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Who is this self?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- The reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But I am not reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Be it so.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let then the reason itself not trouble itself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if any other part of thee suffers, let it have its own opinion about itself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Hindrance to the perceptions of sense is an evil to the animal nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Hindrance to the movements (desires) is equally an evil to the animal nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And something else also is equally an impediment and an evil to the constitution of plants.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "So then that which is a hindrance to the intelligence is an evil to the intelligent nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Apply all these things then to thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Does pain or sensuous pleasure affect thee?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The senses will look to that.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Has any obstacle opposed thee in thy efforts towards an object?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "if indeed thou wast making this effort absolutely (unconditionally, or without any reservation), certainly this obstacle is an evil to thee considered as a rational animal.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if thou takest into consideration the usual course of things, thou hast not yet been injured nor even impeded.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The things however which are proper to the understanding no other man is used to impede, for neither fire, nor iron, nor tyrant, nor abuse, touches it in any way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When it has been made a sphere, it continues a sphere.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is not fit that I should give myself pain, for I have never intentionally given pain even to another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Different things delight different people.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But it is my delight to keep the ruling faculty sound without turning away either from any man or from any of the things which happen to men, but looking at and receiving all with welcome eyes and using everything according to its value.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "See that thou secure this present time to thyself: for those who rather pursue posthumous fame do consider that the men of after time will be exactly such as these whom they cannot bear now;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and both are mortal.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And what is it in any way to thee if these men of after time utter this or that sound, or have this or that opinion about thee?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Take me and cast me where thou wilt;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for there I shall keep my divine part tranquil, that is, content, if it can feel and act conformably to its proper constitution.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is this change of place sufficient reason why my soul should be unhappy and worse than it was, depressed, expanded, shrinking, affrighted?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And what wilt thou find which is sufficient reason for this?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nothing can happen to any man which is not a human accident, nor to an ox which is not according to the nature of an ox, nor to a vine which is not according to the nature of a vine, nor to a stone which is not proper to a stone.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If then there happens to each thing both what is usual and natural, why shouldst thou complain?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the common nature brings nothing which may not be borne by thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If thou art pained by any external thing, it is not this thing that disturbs thee, but thy own judgement about it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And it is in thy power to wipe out this judgement now.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if anything in thy own disposition gives thee pain, who hinders thee from correcting thy opinion?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And even if thou art pained because thou art not doing some particular thing which seems to thee to be right, why dost thou not rather act than complain?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But some insuperable obstacle is in the way?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Do not be grieved then, for the cause of its not being done depends not on thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- But it is not worth while to live if this cannot be done.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Take thy departure then from life contentedly, just as he dies who is in full activity, and well pleased too with the things which are obstacles.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Remember that the ruling faculty is invincible, when self-collected it is satisfied with itself, if it does nothing which it does not choose to do, even if it resist from mere obstinacy.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then will it be when it forms a judgement about anything aided by reason and deliberately?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Therefore the mind which is free from passions is a citadel, for man has nothing more secure to which he can fly for, refuge and for the future be inexpugnable.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He then who has not seen this is an ignorant man;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but he who has seen it and does not fly to this refuge is unhappy.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Say nothing more to thyself than what the first appearances report.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Suppose that it has been reported to thee that a certain person speaks ill of thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This has been reported;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but that thou hast been injured, that has not been reported.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I see that my child is sick.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I do see;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but that he is in danger, I do not see.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thus then always abide by the first appearances, and add nothing thyself from within, and then nothing happens to thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Or rather add something, like a man who knows everything that happens in the world.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A cucumber is bitter.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Throw it away.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- There are briars in the road.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Turn aside from them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- This is enough.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not add, And why were such things made in the world?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thou wilt be ridiculed by a man who is acquainted with nature, as thou wouldst be ridiculed by a carpenter and shoemaker if thou didst find fault because thou seest in their workshop shavings and cuttings from the things which they make.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And yet they have places into which they can throw these shavings and cuttings, and the universal nature has no external space;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but the wondrous part of her art is that though she has circumscribed herself, everything within her which appears to decay and to grow old and to be useless she changes into herself, and again makes other new things from these very same, so that she requires neither substance from without nor wants a place into which she may cast that which decays.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "She is content then with her own space, and her own matter and her own art.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Neither in thy actions be sluggish nor in thy conversation without method, nor wandering in thy thoughts, nor let there be in thy soul inward contention nor external effusion, nor in life be so busy as to have no leisure.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Suppose that men kill thee, cut thee in pieces, curse thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then can these things do to prevent thy mind from remaining pure, wise, sober, just?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For instance, if a man should stand by a limpid pure spring, and curse it, the spring never ceases sending up potable water;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if he should cast clay into it or filth, it will speedily disperse them and wash them out, and will not be at all polluted.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How then shalt thou possess a perpetual fountain and not a mere well?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "By forming thyself hourly to freedom conjoined with contentment, simplicity and modesty.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He who does not know what the world is, does not know where he is.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And he who does not know for what purpose the world exists, does not know who he is, nor what the world is.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But he who has failed in any one of these things could not even say for what purpose he exists himself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then dost thou think of him who avoids or seeks the praise of those who applaud, of men who know not either where they are or who they are?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Dost thou wish to be praised by a man who curses himself thrice every hour?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wouldst thou wish to please a man who does not please himself?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Does a man please himself who repents of nearly everything that he does?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "No longer let thy breathing only act in concert with the air which surrounds thee, but let thy intelligence also now be in harmony with the intelligence which embraces all things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the intelligent power is no less diffused in all parts and pervades all things for him who is willing to draw it to him than the aerial power for him who is able to respire it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Generally, wickedness does no harm at all to the universe;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and particularly, the wickedness of one man does no harm to another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is only harmful to him who has it in his power to be released from it, as soon as he shall choose.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To my own free will the free will of my neighbour is just as indifferent as his poor breath and flesh.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For though we are made especially for the sake of one another, still the ruling power of each of us has its own office, for otherwise my neighbour's wickedness would be my harm, which God has not willed in order that my unhappiness may not depend on another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The sun appears to be poured down, and in all directions indeed it is diffused, yet it is not effused.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For this diffusion is extension: Accordingly its rays are called Extensions [aktines] because they are extended [apo tou ekteinesthai].",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But one may judge what kind of a thing a ray is, if he looks at the sun's light passing through a narrow opening into a darkened room, for it is extended in a right line, and as it were is divided when it meets with any solid body which stands in the way and intercepts the air beyond;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but there the light remains fixed and does not glide or fall off.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Such then ought to be the out-pouring and diffusion of the understanding, and it should in no way be an effusion, but an extension, and it should make no violent or impetuous collision with the obstacles which are in its way;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor yet fall down, but be fixed and enlighten that which receives it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For a body will deprive itself of the illumination, if it does not admit it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He who fears death either fears the loss of sensation or a different kind of sensation.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if thou shalt have no sensation, neither wilt thou feel any harm;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if thou shalt acquire another kind of sensation, thou wilt be a different kind of living being and thou wilt not cease to live.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Men exist for the sake of one another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Teach them then or bear with them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In one way an arrow moves, in another way the mind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The mind indeed, both when it exercises caution and when it is employed about inquiry, moves straight onward not the less, and to its object.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Enter into every man's ruling faculty;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and also let every other man enter into thine.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He ho acts unjustly acts impiously.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For since the universal nature has made rational animals for the sake of one another to help one another according to their deserts, but in no way to injure one another, he who transgresses her will, is clearly guilty of impiety towards the highest divinity.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And he too who lies is guilty of impiety to the same divinity;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for the universal nature is the nature of things that are;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and things that are have a relation to all things that come into existence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And further, this universal nature is named truth, and is the prime cause of all things that are true.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He then who lies intentionally is guilty of impiety inasmuch as he acts unjustly by deceiving;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he also who lies unintentionally, inasmuch as he is at variance with the universal nature, and inasmuch as he disturbs the order by fighting against the nature of the world;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for he fights against it, who is moved of himself to that which is contrary to truth, for he had received powers from nature through the neglect of which he is not able now to distinguish falsehood from truth.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And indeed he who pursues pleasure as good, and avoids pain as evil, is guilty of impiety.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For of necessity such a man must often find fault with the universal nature, alleging that it assigns things to the bad and the good contrary to their deserts, because frequently the bad are in the enjoyment of pleasure and possess the things which procure pleasure, but the good have pain for their share and the things which cause pain.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And further, he who is afraid of pain will sometimes also be afraid of some of the things which will happen in the world, and even this is impiety.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And he who pursues pleasure will not abstain from injustice, and this is plainly impiety.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now with respect to the things towards which the universal nature is equally affected- for it would not have made both, unless it was equally affected towards both- towards these they who wish to follow nature should be of the same mind with it, and equally affected.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "With respect to pain, then, and pleasure, or death and life, or honour and dishonour, which the universal nature employs equally, whoever is not equally affected is manifestly acting impiously.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And I say that the universal nature employs them equally, instead of saying that they happen alike to those who are produced in continuous series and to those who come after them by virtue of a certain original movement of Providence, according to which it moved from a certain beginning to this ordering of things, having conceived certain principles of the things which were to be, and having determined powers productive of beings and of changes and of such like successions.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It would be a man's happiest lot to depart from mankind without having had any taste of lying and hypocrisy and luxury and pride.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "However to breathe out one's life when a man has had enough of these things is the next best voyage, as the saying is.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Hast thou determined to abide with vice, and has not experience yet induced thee to fly from this pestilence?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the destruction of the understanding is a pestilence, much more indeed than any such corruption and change of this atmosphere which surrounds us.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For this corruption is a pestilence of animals so far as they are animals;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but the other is a pestilence of men so far as they are men.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not despise death, but be well content with it, since this too is one of those things which nature wills.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For such as it is to be young and to grow old, and to increase and to reach maturity, and to have teeth and beard and grey hairs, and to beget, and to be pregnant and to bring forth, and all the other natural operations which the seasons of thy life bring, such also is dissolution.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This, then, is consistent with the character of a reflecting man, to be neither careless nor impatient nor contemptuous with respect to death, but to wait for it as one of the operations of nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "As thou now waitest for the time when the child shall come out of thy wife's womb, so be ready for the time when thy soul shall fall out of this envelope.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if thou requirest also a vulgar kind of comfort which shall reach thy heart, thou wilt be made best reconciled to death by observing the objects from which thou art going to be removed, and the morals of those with whom thy soul will no longer be mingled.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For it is no way right to be offended with men, but it is thy duty to care for them and to bear with them gently;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and yet to remember that thy departure will be not from men who have the same principles as thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For this is the only thing, if there be any, which could draw us the contrary way and attach us to life, to be permitted to live with those who have the same principles as ourselves.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But now thou seest how great is the trouble arising from the discordance of those who live together, so that thou mayest say, Come quick, O death, lest perchance I, too, should forget myself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He who does wrong does wrong against himself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He who acts unjustly acts unjustly to himself, because he makes himself bad.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He often acts unjustly who does not do a certain thing;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "not only he who does a certain thing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thy present opinion founded on understanding, and thy present conduct directed to social good, and thy present disposition of contentment with everything which happens- that is enough.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wipe out imagination: check desire: extinguish appetite: keep the ruling faculty in its own power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Among the animals which have not reason one life is distributed;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but among reasonable animals one intelligent soul is distributed: just as there is one earth of all things which are of an earthy nature, and we see by one light, and breathe one air, all of us that have the faculty of vision and all that have life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All things which participate in anything which is common to them all move towards that which is of the same kind with themselves.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everything which is earthy turns towards the earth, everything which is liquid flows together, and everything which is of an aerial kind does the same, so that they require something to keep them asunder, and the application of force.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Fire indeed moves upwards on account of the elemental fire, but it is so ready to be kindled together with all the fire which is here, that even every substance which is somewhat dry, is easily ignited, because there is less mingled with it of that which is a hindrance to ignition.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Accordingly then everything also which participates in the common intelligent nature moves in like manner towards that which is of the same kind with itself, or moves even more.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For so much as it is superior in comparison with all other things, in the same degree also is it more ready to mingle with and to be fused with that which is akin to it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Accordingly among animals devoid of reason we find swarms of bees, and herds of cattle, and the nurture of young birds, and in a manner, loves;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for even in animals there are souls, and that power which brings them together is seen to exert itself in the superior degree, and in such a way as never has been observed in plants nor in stones nor in trees.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But in rational animals there are political communities and friendships, and families and meetings of people;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and in wars, treaties and armistices.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But in the things which are still superior, even though they are separated from one another, unity in a manner exists, as in the stars.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thus the ascent to the higher degree is able to produce a sympathy even in things which are separated.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "See, then, what now takes place.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For only intelligent animals have now forgotten this mutual desire and inclination, and in them alone the property of flowing together is not seen.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But still though men strive to avoid this union, they are caught and held by it, for their nature is too strong for them;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and thou wilt see what I say, if thou only observest.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Sooner, then, will one find anything earthy which comes in contact with no earthy thing than a man altogether separated from other men.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Both man and God and the universe produce fruit;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "at the proper seasons each produces it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if usage has especially fixed these terms to the vine and like things, this is nothing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Reason produces fruit both for all and for itself, and there are produced from it other things of the same kind as reason itself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If thou art able, correct by teaching those who do wrong;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but if thou canst not, remember that indulgence is given to thee for this purpose.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And the gods, too, are indulgent to such persons;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and for some purposes they even help them to get health, wealth, reputation;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "so kind they are.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And it is in thy power also;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or say, who hinders thee?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Labour not as one who is wretched, nor yet as one who would be pitied or admired: but direct thy will to one thing only, to put thyself in motion and to check thyself, as the social reason requires.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To-day I have got out of all trouble, or rather I have cast out all trouble, for it was not outside, but within and in my opinions.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All things are the same, familiar in experience, and ephemeral in time, and worthless in the matter.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everything now is just as it was in the time of those whom we have buried.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Things stand outside of us, themselves by themselves, neither knowing aught of themselves, nor expressing any judgement.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What is it, then, which does judge about them?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The ruling faculty.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Not in passivity, but in activity lie the evil and the good of the rational social animal, just as his virtue and his vice lie not in passivity, but in activity.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the stone which has been thrown up it is no evil to come down, nor indeed any good to have been carried up.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Penetrate inwards into men's leading principles, and thou wilt see what judges thou art afraid of, and what kind of judges they are of themselves.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All things are changing: and thou thyself art in continuous mutation and in a manner in continuous destruction, and the whole universe too.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is thy duty to leave another man's wrongful act there where it is.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Termination of activity, cessation from movement and opinion, and in a sense their death, is no evil.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Turn thy thoughts now to the consideration of thy life, thy life as a child, as a youth, thy manhood, thy old age, for in these also every change was a death.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is this anything to fear?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Turn thy thoughts now to thy life under thy grandfather, then to thy life under thy mother, then to thy life under thy father;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and as thou findest many other differences and changes and terminations, ask thyself, Is this anything to fear?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In like manner, then, neither are the termination and cessation and change of thy whole life a thing to be afraid of.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Hasten to examine thy own ruling faculty and that of the universe and that of thy neighbour: thy own that thou mayest make it just: and that of the universe, that thou mayest remember of what thou art a part;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that of thy neighbour, that thou mayest know whether he has acted ignorantly or with knowledge, and that thou mayest also consider that his ruling faculty is akin to thine.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "As thou thyself art a component part of a social system, so let every act of thine be a component part of social life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Whatever act of thine then has no reference either immediately or remotely to a social end, this tears asunder thy life, and does not allow it to be one, and it is of the nature of a mutiny, just as when in a popular assembly a man acting by himself stands apart from the general agreement.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Quarrels of little children and their sports, and poor spirits carrying about dead bodies, such is everything;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and so what is exhibited in the representation of the mansions of the dead strikes our eyes more clearly.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Examine into the quality of the form of an object, and detach it altogether from its material part, and then contemplate it;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "then determine the time, the longest which a thing of this peculiar form is naturally made to endure.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou hast endured infinite troubles through not being contented with thy ruling faculty, when it does the things which it is constituted by nature to do.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But enough of this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When another blames thee or hates thee, or when men say about thee anything injurious, approach their poor souls, penetrate within, and see what kind of men they are.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou wilt discover that there is no reason to take any trouble that these men may have this or that opinion about thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "However thou must be well disposed towards them, for by nature they are friends.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And the gods too aid them in all ways, by dreams, by signs, towards the attainment of those things on which they set a value.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The periodic movements of the universe are the same, up and down from age to age.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And either the universal intelligence puts itself in motion for every separate effect, and if this is so, be thou content with that which is the result of its activity;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or it puts itself in motion once, and everything else comes by way of sequence in a manner;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or indivisible elements are the origin of all things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- In a word, if there is a god, all is well;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if chance rules, do not thou also be governed by it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Soon will the earth cover us all: then the earth, too, will change, and the things also which result from change will continue to change for ever, and these again for ever.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For if a man reflects on the changes and transformations which follow one another like wave after wave and their rapidity, he will despise everything which is perishable.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The universal cause is like a winter torrent: it carries everything along with it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But how worthless are all these poor people who are engaged in matters political, and, as they suppose, are playing the philosopher!",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All drivellers.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Well then, man: do what nature now requires.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Set thyself in motion, if it is in thy power, and do not look about thee to see if any one will observe it;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor yet expect Plato's Republic: but be content if the smallest thing goes on well, and consider such an event to be no small matter.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For who can change men's opinions?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And without a change of opinions what else is there than the slavery of men who groan while they pretend to obey?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Come now and tell me of Alexander and Philip and Demetrius of Phalerum.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "They themselves shall judge whether they discovered what the common nature required, and trained themselves accordingly.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if they acted like tragedy heroes, no one has condemned me to imitate them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Simple and modest is the work of philosophy.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Draw me not aside to indolence and pride.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Look down from above on the countless herds of men and their countless solemnities, and the infinitely varied voyagings in storms and calms, and the differences among those who are born, who live together, and die.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And consider, too, the life lived by others in olden time, and the life of those who will live after thee, and the life now lived among barbarous nations, and how many know not even thy name, and how many will soon forget it, and how they who perhaps now are praising thee will very soon blame thee, and that neither a posthumous name is of any value, nor reputation, nor anything else.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let there be freedom from perturbations with respect to the things which come from the external cause;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and let there be justice in the things done by virtue of the internal cause, that is, let there be movement and action terminating in this, in social acts, for this is according to thy nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou canst remove out of the way many useless things among those which disturb thee, for they lie entirely in thy opinion;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and thou wilt then gain for thyself ample space by comprehending the whole universe in thy mind, and by contemplating the eternity of time, and observing the rapid change of every several thing, how short is the time from birth to dissolution, and the illimitable time before birth as well as the equally boundless time after dissolution.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All that thou seest will quickly perish, and those who have been spectators of its dissolution will very soon perish too.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And he who dies at the extremest old age will be brought into the same condition with him who died prematurely.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What are these men's leading principles, and about what kind of things are they busy, and for what kind of reasons do they love and honour?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Imagine that thou seest their poor souls laid bare.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When they think that they do harm by their blame or good by their praise, what an idea!",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Loss is nothing else than change.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But the universal nature delights in change, and in obedience to her all things are now done well, and from eternity have been done in like form, and will be such to time without end.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What, then, dost thou say?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That all things have been and all things always will be bad, and that no power has ever been found in so many gods to rectify these things, but the world has been condemned to be found in never ceasing evil?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The rottenness of the matter which is the foundation of everything!",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Water, dust, bones, filth: or again, marble rocks, the callosities of the earth;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and gold and silver, the sediments;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and garments, only bits of hair;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and purple dye, blood;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and everything else is of the same kind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And that which is of the nature of breath is also another thing of the same kind, changing from this to that.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Enough of this wretched life and murmuring and apish tricks.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why art thou disturbed?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What is there new in this?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What unsettles thee?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is it the form of the thing?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Look at it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Or is it the matter?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Look at it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But besides these there is nothing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Towards the gods, then, now become at last more simple and better.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is the same whether we examine these things for a hundred years or three.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If any man has done wrong, the harm is his own.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But perhaps he has not done wrong.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Either all things proceed from one intelligent source and come together as in one body, and the part ought not to find fault with what is done for the benefit of the whole;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or there are only atoms, and nothing else than mixture and dispersion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why, then, art thou disturbed?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Say to the ruling faculty, Art thou dead, art thou corrupted, art thou playing the hypocrite, art thou become a beast, dost thou herd and feed with the rest?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Either the gods have no power or they have power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If, then, they have no power, why dost thou pray to them?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if they have power, why dost thou not pray for them to give thee the faculty of not fearing any of the things which thou fearest, or of not desiring any of the things which thou desirest, or not being pained at anything, rather than pray that any of these things should not happen or happen?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for certainly if they can co-operate with men, they can co-operate for these purposes.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But perhaps thou wilt say, the gods have placed them in thy power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Well, then, is it not better to use what is in thy power like a free man than to desire in a slavish and abject way what is not in thy power?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And who has told thee that the gods do not aid us even in the things which are in our power?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Begin, then, to pray for such things, and thou wilt see.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "One man prays thus: How shall I be able to lie with that woman?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do thou pray thus: How shall I not desire to lie with her?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Another prays thus: How shall I be released from this?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Another prays: How shall I not desire to be released?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Another thus: How shall I not lose my little son?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou thus: How shall I not be afraid to lose him?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In fine, turn thy prayers this way, and see what comes.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Epicurus says, In my sickness my conversation was not about my bodily sufferings, nor, says he, did I talk on such subjects to those who visited me;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but I continued to discourse on the nature of things as before, keeping to this main point, how the mind, while participating in such movements as go on in the poor flesh, shall be free from perturbations and maintain its proper good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nor did I, he says, give the physicians an opportunity of putting on solemn looks, as if they were doing something great, but my life went on well and happily.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do, then, the same that he did both in sickness, if thou art sick, and in any other circumstances;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for never to desert philosophy in any events that may befall us, nor to hold trifling talk either with an ignorant man or with one unacquainted with nature, is a principle of all schools of philosophy;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but to be intent only on that which thou art now doing and on the instrument by which thou doest it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When thou art offended with any man's shameless conduct, immediately ask thyself, Is it possible, then, that shameless men should not be in the world?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is not possible.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not, then, require what is impossible.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For this man also is one of those shameless men who must of necessity be in the world.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let the same considerations be present to thy mind in the case of the knave, and the faithless man, and of every man who does wrong in any way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For at the same time that thou dost remind thyself that it is impossible that such kind of men should not exist, thou wilt become more kindly disposed towards every one individually.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is useful to perceive this, too, immediately when the occasion arises, what virtue nature has given to man to oppose to every wrongful act.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For she has given to man, as an antidote against the stupid man, mildness, and against another kind of man some other power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And in all cases it is possible for thee to correct by teaching the man who is gone astray;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for every man who errs misses his object and is gone astray.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Besides wherein hast thou been injured?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thou wilt find that no one among those against whom thou art irritated has done anything by which thy mind could be made worse;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but that which is evil to thee and harmful has its foundation only in the mind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And what harm is done or what is there strange, if the man who has not been instructed does the acts of an uninstructed man?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider whether thou shouldst not rather blame thyself, because thou didst not expect such a man to err in such a way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thou hadst means given thee by thy reason to suppose that it was likely that he would commit this error, and yet thou hast forgotten and art amazed that he has erred.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But most of all when thou blamest a man as faithless or ungrateful, turn to thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the fault is manifestly thy own, whether thou didst trust that a man who had such a disposition would keep his promise, or when conferring thy kindness thou didst not confer it absolutely, nor yet in such way as to have received from thy very act all the profit.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what more dost thou want when thou hast done a man a service?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Art thou not content that thou hast done something conformable to thy nature, and dost thou seek to be paid for it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Just as if the eye demanded a recompense for seeing, or the feet for walking.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For as these members are formed for a particular purpose, and by working according to their several constitutions obtain what is their own;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "so also as man is formed by nature to acts of benevolence, when he has done anything benevolent or in any other way conducive to the common interest, he has acted conformably to his constitution, and he gets what is his own.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wilt thou, then, my soul, never be good and simple and one and naked, more manifest than the body which surrounds thee?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wilt thou never enjoy an affectionate and contented disposition?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wilt thou never be full and without a want of any kind, longing for nothing more, nor desiring anything, either animate or inanimate, for the enjoyment of pleasures?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nor yet desiring time wherein thou shalt have longer enjoyment, or place, or pleasant climate, or society of men with whom thou mayest live in harmony?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But wilt thou be satisfied with thy present condition, and pleased with all that is about thee, and wilt thou convince thyself that thou hast everything and that it comes from the gods, that everything is well for thee, and will be well whatever shall please them, and whatever they shall give for the conservation of the perfect living being, the good and just and beautiful, which generates and holds together all things, and contains and embraces all things which are dissolved for the production of other like things?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Wilt thou never be such that thou shalt so dwell in community with gods and men as neither to find fault with them at all, nor to be condemned by them?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Observe what thy nature requires, so far as thou art governed by nature only: then do it and accept it, if thy nature, so far as thou art a living being, shall not be made worse by it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And next thou must observe what thy nature requires so far as thou art a living being.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And all this thou mayest allow thyself, if thy nature, so far as thou art a rational animal, shall not be made worse by it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But the rational animal is consequently also a political (social) animal.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Use these rules, then, and trouble thyself about nothing else.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Everything which happens either happens in such wise as thou art formed by nature to bear it, or as thou art not formed by nature to bear it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If, then, it happens to thee in such way as thou art formed by nature to bear it, do not complain, but bear it as thou art formed by nature to bear it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if it happens in such wise as thou art not formed by nature to bear it, do not complain, for it will perish after it has consumed thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Remember, however, that thou art formed by nature to bear everything, with respect to which it depends on thy own opinion to make it endurable and tolerable, by thinking that it is either thy interest or thy duty to do this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If a man is mistaken, instruct him kindly and show him his error.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if thou art not able, blame thyself, or blame not even thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Whatever may happen to thee, it was prepared for thee from all eternity;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the implication of causes was from eternity spinning the thread of thy being, and of that which is incident to it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Whether the universe is a concourse of atoms, or nature is a system, let this first be established, that I am a part of the whole which is governed by nature;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "next, I am in a manner intimately related to the parts which are of the same kind with myself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For remembering this, inasmuch as I am a part, I shall be discontented with none of the things which are assigned to me out of the whole;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for nothing is injurious to the part, if it is for the advantage of the whole.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the whole contains nothing which is not for its advantage;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and all natures indeed have this common principle, but the nature of the universe has this principle besides, that it cannot be compelled even by any external cause to generate anything harmful to itself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "By remembering, then, that I am a part of such a whole, I shall be content with everything that happens.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And inasmuch as I am in a manner intimately related to the parts which are of the same kind with myself, I shall do nothing unsocial, but I shall rather direct myself to the things which are of the same kind with myself, and I shall turn an my efforts to the common interest, and divert them from the contrary.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now, if these things are done so, life must flow on happily, just as thou mayest observe that the life of a citizen is happy, who continues a course of action which is advantageous to his fellow-citizens, and is content with whatever the state may assign to him.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The parts of the whole, everything, I mean, which is naturally comprehended in the universe, must of necessity perish;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but let this be understood in this sense, that they must undergo change.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if this is naturally both an evil and a necessity for the parts, the whole would not continue to exist in a good condition, the parts being subject to change and constituted so as to perish in various ways.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For whether did nature herself design to do evil to the things which are parts of herself, and to make them subject to evil and of necessity fall into evil, or have such results happened without her knowing it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Both these suppositions, indeed, are incredible.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if a man should even drop the term Nature (as an efficient power), and should speak of these things as natural, even then it would be ridiculous to affirm at the same time that the parts of the whole are in their nature subject to change, and at the same time to be surprised or vexed as if something were happening contrary to nature, particularly as the dissolution of things is into those things of which each thing is composed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For there is either a dispersion of the elements out of which everything has been compounded, or a change from the solid to the earthy and from the airy to the aerial, so that these parts are taken back into the universal reason, whether this at certain periods is consumed by fire or renewed by eternal changes.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And do not imagine that the solid and the airy part belong to thee from the time of generation.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For all this received its accretion only yesterday and the day before, as one may say, from the food and the air which is inspired.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This, then, which has received the accretion, changes, not that which thy mother brought forth.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But suppose that this which thy mother brought forth implicates thee very much with that other part, which has the peculiar quality of change, this is nothing in fact in the way of objection to what is said.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When thou hast assumed these names, good, modest, true, rational, a man of equanimity, and magnanimous, take care that thou dost not change these names;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if thou shouldst lose them, quickly return to them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And remember that the term Rational was intended to signify a discriminating attention to every several thing and freedom from negligence;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that Equanimity is the voluntary acceptance of the things which are assigned to thee by the common nature;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that Magnanimity is the elevation of the intelligent part above the pleasurable or painful sensations of the flesh, and above that poor thing called fame, and death, and all such things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If, then, thou maintainest thyself in the possession of these names, without desiring to be called by these names by others, thou wilt be another person and wilt enter on another life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For to continue to be such as thou hast hitherto been, and to be tom in pieces and defiled in such a life, is the character of a very stupid man and one overfond of his life, and like those half-devoured fighters with wild beasts, who though covered with wounds and gore, still intreat to be kept to the following day, though they will be exposed in the same state to the same claws and bites.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Therefore fix thyself in the possession of these few names: and if thou art able to abide in them, abide as if thou wast removed to certain islands of the Happy.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if thou shalt perceive that thou fallest out of them and dost not maintain thy hold, go courageously into some nook where thou shalt maintain them, or even depart at once from life, not in passion, but with simplicity and freedom and modesty, after doing this one laudable thing at least in thy life, to have gone out of it thus.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In order, however, to the remembrance of these names, it will greatly help thee, if thou rememberest the gods, and that they wish not to be flattered, but wish all reasonable beings to be made like themselves;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if thou rememberest that what does the work of a fig-tree is a fig-tree, and that what does the work of a dog is a dog, and that what does the work of a bee is a bee, and that what does the work of a man is a man.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Mimi, war, astonishment, torpor, slavery, will daily wipe out those holy principles of thine.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How many things without studying nature dost thou imagine, and how many dost thou neglect?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But it is thy duty so to look on and so to do everything, that at the same time the power of dealing with circumstances is perfected, and the contemplative faculty is exercised, and the confidence which comes from the knowledge of each several thing is maintained without showing it, but yet not concealed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For when wilt thou enjoy simplicity, when gravity, and when the knowledge of every several thing, both what it is in substance, and what place it has in the universe, and how long it is formed to exist and of what things it is compounded, and to whom it can belong, and who are able both to give it and take it away?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A spider is proud when it has caught a fly, and another when he has caught a poor hare, and another when he has taken a little fish in a net, and another when he has taken wild boars, and another when he has taken bears, and another when he has taken Sarmatians.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Are not these robbers, if thou examinest their opinions?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Acquire the contemplative way of seeing how all things change into one another, and constantly attend to it, and exercise thyself about this part of philosophy.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For nothing is so much adapted to produce magnanimity.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Such a man has put off the body, and as he sees that he must, no one knows how soon, go away from among men and leave everything here, he gives himself up entirely to just doing in all his actions, and in everything else that happens he resigns himself to the universal nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But as to what any man shall say or think about him or do against him, he never even thinks of it, being himself contented with these two things, with acting justly in what he now does, and being satisfied with what is now assigned to him;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he lays aside all distracting and busy pursuits, and desires nothing else than to accomplish the straight course through the law, and by accomplishing the straight course to follow God.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What need is there of suspicious fear, since it is in thy power to inquire what ought to be done?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And if thou seest clear, go by this way content, without turning back: but if thou dost not see clear, stop and take the best advisers.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if any other things oppose thee, go on according to thy powers with due consideration, keeping to that which appears to be just.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For it is best to reach this object, and if thou dost fail, let thy failure be in attempting this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He who follows reason in all things is both tranquil and active at the same time, and also cheerful and collected.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Inquire of thyself as soon as thou wakest from sleep, whether it will make any difference to thee, if another does what is just and right.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It will make no difference.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou hast not forgotten, I suppose, that those who assume arrogant airs in bestowing their praise or blame on others, are such as they are at bed and at board, and thou hast not forgotten what they do, and what they avoid and what they pursue, and how they steal and how they rob, not with hands and feet, but with their most valuable part, by means of which there is produced, when a man chooses, fidelity, modesty, truth, law, a good daemon (happiness)?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To her who gives and takes back all, to nature, the man who is instructed and modest says, Give what thou wilt;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "take back what thou wilt.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And he says this not proudly, but obediently and well pleased with her.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Short is the little which remains to thee of life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Live as on a mountain.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For it makes no difference whether a man lives there or here, if he lives everywhere in the world as in a state (political community).",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let men see, let them know a real man who lives according to nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If they cannot endure him, let them kill him.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For that is better than to live thus as men do.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "No longer talk at all about the kind of man that a good man ought to be, but be such.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Constantly contemplate the whole of time and the whole of substance, and consider that all individual things as to substance are a grain of a fig, and as to time, the turning of a gimlet.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Look at everything that exists, and observe that it is already in dissolution and in change, and as it were putrefaction or dispersion, or that everything is so constituted by nature as to die.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider what men are when they are eating, sleeping, generating, easing themselves and so forth.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Then what kind of men they are when they are imperious and arrogant, or angry and scolding from their elevated place.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But a short time ago to how many they were slaves and for what things;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and after a little time consider in what a condition they will be.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That is for the good of each thing, which the universal nature brings to each.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And it is for its good at the time when nature brings it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "\\"The earth loves the shower\\";",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and \\"the solemn aether loves\\": and the universe loves to make whatever is about to be.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I say then to the universe, that I love as thou lovest.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And is not this too said, that \\"this or that loves (is wont) to be produced\\"?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Either thou livest here and hast already accustomed thyself to it, or thou art going away, and this was thy own will;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or thou art dying and hast discharged thy duty.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But besides these things there is nothing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Be of good cheer, then.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let this always be plain to thee, that this piece of land is like any other;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and that all things here are the same with things on top of a mountain, or on the sea-shore, or wherever thou choosest to be.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thou wilt find just what Plato says, Dwelling within the walls of a city as in a shepherd's fold on a mountain.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What is my ruling faculty now to me?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And of what nature am I now making it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And for what purpose am I now using it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is it void of understanding?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is it loosed and rent asunder from social life?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is it melted into and mixed with the poor flesh so as to move together with it?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He who flies from his master is a runaway;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but the law is master, and he who breaks the law is a runaway.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And he also who is grieved or angry or afraid, is dissatisfied because something has been or is or shall be of the things which are appointed by him who rules all things, and he is Law, and assigns to every man what is fit.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He then who fears or is grieved or is angry is a runaway.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A man deposits seed in a womb and goes away, and then another cause takes it, and labours on it and makes a child.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What a thing from such a material!",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Again, the child passes food down through the throat, and then another cause takes it and makes perception and motion, and in fine life and strength and other things;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "how many and how strange I Observe then the things which are produced in such a hidden way, and see the power just as we see the power which carries things downwards and upwards, not with the eyes, but still no less plainly.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Constantly consider how all things such as they now are, in time past also were;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and consider that they will be the same again.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And place before thy eyes entire dramas and stages of the same form, whatever thou hast learned from thy experience or from older history;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for example, the whole court of Hadrian, and the whole court of Antoninus, and the whole court of Philip, Alexander, Croesus;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for all those were such dramas as we see now, only with different actors.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Imagine every man who is grieved at anything or discontented to be like a pig which is sacrificed and kicks and screams.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Like this pig also is he who on his bed in silence laments the bonds in which we are held.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And consider that only to the rational animal is it given to follow voluntarily what happens;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but simply to follow is a necessity imposed on all.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Severally on the occasion of everything that thou doest, pause and ask thyself, if death is a dreadful thing because it deprives thee of this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When thou art offended at any man's fault, forthwith turn to thyself and reflect in what like manner thou dost err thyself;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for example, in thinking that money is a good thing, or pleasure, or a bit of reputation, and the like.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For by attending to this thou wilt quickly forget thy anger, if this consideration also is added, that the man is compelled: for what else could he do?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or, if thou art able, take away from him the compulsion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When thou hast seen Satyron the Socratic, think of either Eutyches or Hymen, and when thou hast seen Euphrates, think of Eutychion or Silvanus, and when thou hast seen Alciphron think of Tropaeophorus, and when thou hast seen Xenophon think of Crito or Severus, and when thou hast looked on thyself, think of any other Caesar, and in the case of every one do in like manner.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Then let this thought be in thy mind, Where then are those men?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nowhere, or nobody knows where.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thus continuously thou wilt look at human things as smoke and nothing at all;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "especially if thou reflectest at the same time that what has once changed will never exist again in the infinite duration of time.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But thou, in what a brief space of time is thy existence?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And why art thou not content to pass through this short time in an orderly way?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What matter and opportunity for thy activity art thou avoiding?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what else are all these things, except exercises for the reason, when it has viewed carefully and by examination into their nature the things which happen in life?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Persevere then until thou shalt have made these things thy own, as the stomach which is strengthened makes all things its own, as the blazing fire makes flame and brightness out of everything that is thrown into it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let it not be in any man's power to say truly of thee that thou art not simple or that thou are not good;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but let him be a liar whoever shall think anything of this kind about thee;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and this is altogether in thy power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For who is he that shall hinder thee from being good and simple?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do thou only determine to live no longer, unless thou shalt be such.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For neither does reason allow thee to live, if thou art not such.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What is that which as to this material (our life) can be done or said in the way most conformable to reason.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For whatever this may be, it is in thy power to do it or to say it, and do not make excuses that thou art hindered.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou wilt not cease to lament till thy mind is in such a condition that, what luxury is to those who enjoy pleasure, such shall be to thee, in the matter which is subjected and presented to thee, the doing of the things which are conformable to man's constitution;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for a man ought to consider as an enjoyment everything which it is in his power to do according to his own nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And it is in his power everywhere.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now, it is not given to a cylinder to move everywhere by its own motion, nor yet to water nor to fire, nor to anything else which is governed by nature or an irrational soul, for the things which check them and stand in the way are many.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But intelligence and reason are able to go through everything that opposes them, and in such manner as they are formed by nature and as they choose.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Place before thy eyes this facility with which the reason will be carried through all things, as fire upwards, as a stone downwards, as a cylinder down an inclined surface, and seek for nothing further.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For all other obstacles either affect the body only which is a dead thing;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or, except through opinion and the yielding of the reason itself, they do not crush nor do any harm of any kind;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for if they did, he who felt it would immediately become bad.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now, in the case of all things which have a certain constitution, whatever harm may happen to any of them, that which is so affected becomes consequently worse;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but in the like case, a man becomes both better, if one may say so, and more worthy of praise by making a right use of these accidents.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And finally remember that nothing harms him who is really a citizen, which does not harm the state;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor yet does anything harm the state, which does not harm law (order);",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and of these things which are called misfortunes not one harms law.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What then does not harm law does not harm either state or citizen.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To him who is penetrated by true principles even the briefest precept is sufficient, and any common precept, to remind him that he should be free from grief and fear.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For example-   Leaves, some the wind scatters on the ground-  So is the race of men.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Leaves, also, are thy children;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and leaves, too, are they who cry out as if they were worthy of credit and bestow their praise, or on the contrary curse, or secretly blame and sneer;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and leaves, in like manner, are those who shall receive and transmit a man's fame to aftertimes.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For all such things as these \\"are produced in the season of spring,\\" as the poet says;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "then the wind casts them down;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "then the forest produces other leaves in their places.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But a brief existence is common to all things, and yet thou avoidest and pursuest all things as if they would be eternal.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A little time, and thou shalt close thy eyes;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and him who has attended thee to thy grave another soon will lament.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The healthy eye ought to see all visible things and not to say, I wish for green things;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for this is the condition of a diseased eye.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And the healthy hearing and smelling ought to be ready to perceive all that can be heard and smelled.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And the healthy stomach ought to be with respect to all food just as the mill with respect to all things which it is formed to grind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And accordingly the healthy understanding ought to be prepared for everything which happens;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but that which says, Let my dear children live, and let all men praise whatever I may do, is an eye which seeks for green things, or teeth which seek for soft things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "There is no man so fortunate that there shall not be by him when he is dying some who are pleased with what is going to happen.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Suppose that he was a good and wise man, will there not be at last some one to say to himself, Let us at last breathe freely being relieved from this schoolmaster?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It is true that he was harsh to none of us, but I perceived that he tacitly condemns us.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- This is what is said of a good man.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But in our own case how many other things are there for which there are many who wish to get rid of us.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou wilt consider this then when thou art dying, and thou wilt depart more contentedly by reflecting thus: I am going away from such a life, in which even my associates in behalf of whom I have striven so much, prayed, and cared, themselves wish me to depart, hoping perchance to get some little advantage by it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Why then should a man cling to a longer stay here?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Do not however for this reason go away less kindly disposed to them, but preserving thy own character, and friendly and benevolent and mild, and on the other hand not as if thou wast torn away;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but as when a man dies a quiet death, the poor soul is easily separated from the body, such also ought thy departure from men to be, for nature united thee to them and associated thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But does she now dissolve the union?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Well, I am separated as from kinsmen, not however dragged resisting, but without compulsion;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for this too is one of the things according to nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Accustom thyself as much as possible on the occasion of anything being done by any person to inquire with thyself, For what object is this man doing this?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But begin with thyself, and examine thyself first.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Remember that this which pulls the strings is the thing which is hidden within: this is the power of persuasion, this is life, this, if one may so say, is man.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In contemplating thyself never include the vessel which surrounds thee and these instruments which are attached about it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For they are like to an axe, differing only in this that they grow to the body.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For indeed there is no more use in these parts without the cause which moves and checks them than in the weaver's shuttle, and the writer's pen and the driver's whip.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "These are the properties of the rational soul: it sees itself, analyses itself, and makes itself such as it chooses;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "the fruit which it bears itself enjoys- for the fruits of plants and that in animals which corresponds to fruits others enjoy- it obtains its own end, wherever the limit of life may be fixed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Not as in a dance and in a play and in such like things, where the whole action is incomplete, if anything cuts it short;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but in every part and wherever it may be stopped, it makes what has been set before it full and complete, so that it can say, I have what is my own.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And further it traverses the whole universe, and the surrounding vacuum, and surveys its form, and it extends itself into the infinity of time, and embraces and comprehends the periodical renovation of all things, and it comprehends that those who come after us will see nothing new, nor have those before us seen anything more, but in a manner he who is forty years old, if he has any understanding at all, has seen by virtue of the uniformity that prevails all things which have been and all that will be.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "This too is a property of the rational soul, love of one's neighbour, and truth and modesty, and to value nothing more more than itself, which is also the property of Law.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thus then right reason differs not at all from the reason of justice.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thou wilt set little value on pleasing song and dancing and the pancratium, if thou wilt distribute the melody of the voice into its several sounds, and ask thyself as to each, if thou art mastered by this;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for thou wilt be prevented by shame from confessing it: and in the matter of dancing, if at each movement and attitude thou wilt do the same;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and the like also in the matter of the pancratium.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In all things, then, except virtue and the acts of virtue, remember to apply thyself to their several parts, and by this division to come to value them little: and apply this rule also to thy whole life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What a soul that is which is ready, if at any moment it must be separated from the body, and ready either to be extinguished or dispersed or continue to exist;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but so that this readiness comes from a man's own judgement, not from mere obstinacy, as with the Christians, but considerately and with dignity and in a way to persuade another, without tragic show.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Have I done something for the general interest?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Well then I have had my reward.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let this always be present to thy mind, and never stop doing such good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What is thy art?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To be good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And how is this accomplished well except by general principles, some about the nature of the universe, and others about the proper constitution of man?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "At first tragedies were brought on the stage as means of reminding men of the things which happen to them, and that it is according to nature for things to happen so, and that, if you are delighted with what is shown on the stage, you should not be troubled with that which takes place on the larger stage.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For you see that these things must be accomplished thus, and that even they bear them who cry out \\"O Cithaeron.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "\\" And, indeed, some things are said well by the dramatic writers, of which kind is the following especially:-   Me and my children if the gods neglect,  This has its reason too.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And again-   We must not chale and fret at that which happens.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And   Life's harvest reap like the wheat's fruitful ear.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And other things of the same kind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "After tragedy the old comedy was introduced, which had a magisterial freedom of speech, and by its very plainness of speaking was useful in reminding men to beware of insolence;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and for this purpose too Diogenes used to take from these writers.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But as to the middle comedy which came next, observe what it was, and again, for what object the new comedy was introduced, which gradually sunk down into a mere mimic artifice.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "That some good things are said even by these writers, everybody knows: but the whole plan of such poetry and dramaturgy, to what end does it look!",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How plain does it appear that there is not another condition of life so well suited for philosophising as this in which thou now happenest to be.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A branch cut off from the adjacent branch must of necessity be cut off from the whole tree also.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "So too a man when he is separated from another man has fallen off from the whole social community.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now as to a branch, another cuts it off, but a man by his own act separates himself from his neighbour when he hates him and turns away from him, and he does not know that he has at the same time cut himself off from the whole social system.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Yet he has this privilege certainly from Zeus who framed society, for it is in our power to grow again to that which is near to us, and be to come a part which helps to make up the whole.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "However, if it often happens, this kind of separation, it makes it difficult for that which detaches itself to be brought to unity and to be restored to its former condition.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Finally, the branch, which from the first grew together with the tree, and has continued to have one life with it, is not like that which after being cut off is then ingrafted, for this is something like what the gardeners mean when they say that it grows with the rest of the tree, but that it has not the same mind with it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "As those who try to stand in thy way when thou art proceeding according to right reason, will not be able to turn thee aside from thy proper action, so neither let them drive thee from thy benevolent feelings towards them, but be on thy guard equally in both matters, not only in the matter of steady judgement and action, but also in the matter of gentleness towards those who try to hinder or otherwise trouble thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For this also is a weakness, to be vexed at them, as well as to be diverted from thy course of action and to give way through fear;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for both are equally deserters from their post, the man who does it through fear, and the man who is alienated from him who is by nature a kinsman and a friend.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "There is no nature which is inferior to art, for the arts imitate the nature of things.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if this is so, that nature which is the most perfect and the most comprehensive of all natures, cannot fall short of the skill of art.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Now all arts do the inferior things for the sake of the superior;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "therefore the universal nature does so too.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And, indeed, hence is the origin of justice, and in justice the other virtues have their foundation: for justice will not be observed, if we either care for middle things (things indifferent), or are easily deceived and careless and changeable.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If the things do not come to thee, the pursuits and avoidances of which disturb thee, still in a manner thou goest to them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let then thy judgement about them be at rest, and they will remain quiet, and thou wilt not be seen either pursuing or avoiding.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The spherical form of the soul maintains its figure, when it is neither extended towards any object, nor contracted inwards, nor dispersed nor sinks down, but is illuminated by light, by which it sees the truth, the truth of all things and the truth that is in itself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Suppose any man shall despise me.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let him look to that himself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But I will look to this, that I be not discovered doing or saying anything deserving of contempt.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Shall any man hate me?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Let him look to it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But I will be mild and benevolent towards every man, and ready to show even him his mistake, not reproachfully, nor yet as making a display of my endurance, but nobly and honestly, like the great Phocion, unless indeed he only assumed it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the interior parts ought to be such, and a man ought to be seen by the gods neither dissatisfied with anything nor complaining.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what evil is it to thee, if thou art now doing what is agreeable to thy own nature, and art satisfied with that which at this moment is suitable to the nature of the universe, since thou art a human being placed at thy post in order that what is for the common advantage may be done in some way?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Men despise one another and flatter one another;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and men wish to raise themselves above one another, and crouch before one another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How unsound and insincere is he who says, I have determined to deal with thee in a fair way.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- What art thou doing, man?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "There is no occasion to give this notice.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "It will soon show itself by acts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The voice ought to be plainly written on the forehead.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Such as a man's character is, he immediately shows it in his eyes, just as he who is beloved forthwith reads everything in the eyes of lovers.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The man who is honest and good ought to be exactly like a man who smells strong, so that the bystander as soon as he comes near him must smell whether he choose or not.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But the affectation of simplicity is like a crooked stick.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Nothing is more disgraceful than a wolfish friendship (false friendship).",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Avoid this most of all.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The good and simple and benevolent show all these things in the eyes, and there is no mistaking.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "As to living in the best way, this power is in the soul, if it be indifferent to things which are indifferent.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And it will be indifferent, if it looks on each of these things separately and all together, and if it remembers that not one of them produces in us an opinion about itself, nor comes to us;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but these things remain immovable, and it is we ourselves who produce the judgements about them, and, as we may say, write them in ourselves, it being in our power not to write them, and it being in our power, if perchance these judgements have imperceptibly got admission to our minds, to wipe them out;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if we remember also that such attention will only be for a short time, and then life will be at an end.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Besides, what trouble is there at all in doing this?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For if these things are according to nature, rejoice in them, and they will be easy to thee: but if contrary to nature, seek what is conformable to thy own nature, and strive towards this, even if it bring no reputation;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for every man is allowed to seek his own good.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider whence each thing is come, and of what it consists, and into what it changes, and what kind of a thing it will be when it has changed, and that it will sustain no harm.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If any have offended against thee, consider first: What is my relation to men, and that we are made for one another;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and in another respect, I was made to be set over them, as a ram over the flock or a bull over the herd.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But examine the matter from first principles, from this: If all things are not mere atoms, it is nature which orders all things: if this is so, the inferior things exist for the sake of the superior, and these for the sake of one another.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Second, consider what kind of men they are at table, in bed, and so forth: and particularly, under what compulsions in respect of opinions they are;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and as to their acts, consider with what pride they do what they do.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Third, that if men do rightly what they do, we ought not to be displeased;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but if they do not right, it is plain that they do so involuntarily and in ignorance.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For as every soul is unwillingly deprived of the truth, so also is it unwillingly deprived of the power of behaving to each man according to his deserts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Accordingly men are pained when they are called unjust, ungrateful, and greedy, and in a word wrong-doers to their neighbours.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Fourth, consider that thou also doest many things wrong, and that thou art a man like others;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and even if thou dost abstain from certain faults, still thou hast the disposition to commit them, though either through cowardice, or concern about reputation, or some such mean motive, thou dost abstain from such faults.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Fifth, consider that thou dost not even understand whether men are doing wrong or not, for many things are done with a certain reference to circumstances.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And in short, a man must learn a great deal to enable him to pass a correct judgement on another man's acts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Sixth, consider when thou art much vexed or grieved, that man's life is only a moment, and after a short time we are all laid out dead.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Seventh, that it is not men's acts which disturb us, for those acts have their foundation in men's ruling principles, but it is our own opinions which disturb us.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Take away these opinions then, and resolve to dismiss thy judgement about an act as if it were something grievous, and thy anger is gone.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How then shall I take away these opinions?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "By reflecting that no wrongful act of another brings shame on thee: for unless that which is shameful is alone bad, thou also must of necessity do many things wrong, and become a robber and everything else.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Eighth, consider how much more pain is brought on us by the anger and vexation caused by such acts than by the acts themselves, at which we are angry and vexed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Ninth, consider that a good disposition is invincible, if it be genuine, and not an affected smile and acting a part.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what will the most violent man do to thee, if thou continuest to be of a kind disposition towards him, and if, as opportunity offers, thou gently admonishest him and calmly correctest his errors at the very time when he is trying to do thee harm, saying, Not so, my child: we are constituted by nature for something else: I shall certainly not be injured, but thou art injuring thyself, my child.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- And show him with gentle tact and by general principles that this is so, and that even bees do not do as he does, nor any animals which are formed by nature to be gregarious.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And thou must do this neither with any double meaning nor in the way of reproach, but affectionately and without any rancour in thy soul;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and not as if thou wert lecturing him, nor yet that any bystander may admire, but either when he is alone, and if others are present...",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Remember these nine rules, as if thou hadst received them as a gift from the Muses, and begin at last to be a man while thou livest.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But thou must equally avoid flattering men and being veied at them, for both are unsocial and lead to harm.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And let this truth be present to thee in the excitement of anger, that to be moved by passion is not manly, but that mildness and gentleness, as they are more agreeable to human nature, so also are they more manly;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and he who possesses these qualities possesses strength, nerves and courage, and not the man who is subject to fits of passion and discontent.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For in the same degree in which a man's mind is nearer to freedom from all passion, in the same degree also is it nearer to strength: and as the sense of pain is a characteristic of weakness, so also is anger.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For he who yields to pain and he who yields to anger, both are wounded and both submit.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if thou wilt, receive also a tenth present from the leader of the Muses (Apollo), and it is this- that to expect bad men not to do wrong is madness, for he who expects this desires an impossibility.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But to allow men to behave so to others, and to expect them not to do thee any wrong, is irrational and tyrannical.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "There are four principal aberrations of the superior faculty against which thou shouldst be constantly on thy guard, and when thou hast detected them, thou shouldst wipe them out and say on each occasion thus: this thought is not necessary: this tends to destroy social union: this which thou art going to say comes not from the real thoughts;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for thou shouldst consider it among the most absurd of things for a man not to speak from his real thoughts.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But the fourth is when thou shalt reproach thyself for anything, for this is an evidence of the diviner part within thee being overpowered and yielding to the less honourable and to the perishable part, the body, and to its gross pleasures.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Thy aerial part and all the fiery parts which are mingled in thee, though by nature they have an upward tendency, still in obedience to the disposition of the universe they are overpowered here in the compound mass (the body).",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And also the whole of the earthy part in thee and the watery, though their tendency is downward, still are raised up and occupy a position which is not their natural one.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In this manner then the elemental parts obey the universal, for when they have been fixed in any place perforce they remain there until again the universal shall sound the signal for dissolution.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is it not then strange that thy intelligent part only should be disobedient and discontented with its own place?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And yet no force is imposed on it, but only those things which are conformable to its nature: still it does not submit, but is carried in the opposite direction.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For the movement towards injustice and intemperance and to anger and grief and fear is nothing else than the act of one who deviates from nature.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And also when the ruling faculty is discontented with anything that happens, then too it deserts its post: for it is constituted for piety and reverence towards the gods no less than for justice.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For these qualities also are comprehended under the generic term of contentment with the constitution of things, and indeed they are prior to acts of justice.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "He who has not one and always the same object in life, cannot be one and the same all through his life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But what I have said is not enough, unless this also is added, what this object ought to be.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For as there is not the same opinion about all the things which in some way or other are considered by the majority to be good, but only about some certain things, that is, things which concern the common interest;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "so also ought we to propose to ourselves an object which shall be of a common kind (social) and political.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For he who directs all his own efforts to this object, will make all his acts alike, and thus will always be the same.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Think of the country mouse and of the town mouse, and of the alarm and trepidation of the town mouse.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Socrates used to call the opinions of the many by the name of Lamiae, bugbears to frighten children.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The Lacedaemonians at their public spectacles used to set seats in the shade for strangers, but themselves sat down anywhere.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Socrates excused himself to Perdiccas for not going to him, saying, It is because I would not perish by the worst of all ends, that is, I would not receive a favour and then be unable to return it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the writings of the Ephesians there was this precept, constantly to think of some one of the men of former times who practised virtue.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The Pythagoreans bid us in the morning look to the heavens that we may be reminded of those bodies which continually do the same things and in the same manner perform their work, and also be reminded of their purity and nudity.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For there is no veil over a star.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider what a man Socrates was when he dressed himself in a skin, after Xanthippe had taken his cloak and gone out, and what Socrates said to his friends who were ashamed of him and drew back from him when they saw him dressed thus.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Neither in writing nor in reading wilt thou be able to lay down rules for others before thou shalt have first learned to obey rules thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Much more is this so in life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "A slave thou art: free speech is not for thee.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And my heart laughed within.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And virtue they will curse, speaking harsh words.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "To look for the fig in winter is a madman's act: such is he who looks for his child when it is no longer allowed.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When a man kisses his child, said Epictetus, he should whisper to himself, \\"To-morrow perchance thou wilt die.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "\\"- But those are words of bad omen.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- \\"No word is a word of bad omen,\\" said Epictetus, \\"which expresses any work of nature;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "or if it is so, it is also a word of bad omen to speak of the ears of corn being reaped.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "\\"   The unripe grape, the ripe bunch, the dried grape, all are changes, not into nothing, but into something which exists not yet.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "No man can rob us of our free will.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Epictetus also said, A man must discover an art (or rules) with respect to giving his assent;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and in respect to his movements he must be careful that they be made with regard to circumstances, that they be consistent with social interests, that they have regard to the value of the object;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and as to sensual desire, he should altogether keep away from it;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and as to avoidance (aversion) he should not show it with respect to any of the things which are not in our power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The dispute then, he said, is not about any common matter, but about being mad or not.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Socrates used to say, What do you want?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Souls of rational men or irrational?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Souls of rational men.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Of what rational men?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Sound or unsound?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Sound.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Why then do you not seek for them?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Because we have them.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- Why then do you fight and quarrel?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "All those things at which thou wishest to arrive by a circuitous road, thou canst have now, if thou dost not refuse them to thyself.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And this means, if thou wilt take no notice of all the past, and trust the future to providence, and direct the present only conformably to piety and justice.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Conformably to piety, that thou mayest be content with the lot which is assigned to thee, for nature designed it for thee and thee for it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Conformably to justice, that thou mayest always speak the truth freely and without disguise, and do the things which are agreeable to law and according to the worth of each.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And let neither another man's wickedness hinder thee, nor opinion nor voice, nor yet the sensations of the poor flesh which has grown about thee;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for the passive part will look to this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If then, whatever the time may be when thou shalt be near to thy departure, neglecting everything else thou shalt respect only thy ruling faculty and the divinity within thee, and if thou shalt be afraid not because thou must some time cease to live, but if thou shalt fear never to have begun to live according to nature- then thou wilt be a man worthy of the universe which has produced thee, and thou wilt cease to be a stranger in thy native land, and to wonder at things which happen daily as if they were something unexpected, and to be dependent on this or that.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "God sees the minds (ruling principles) of all men bared of the material vesture and rind and impurities.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For with his intellectual part alone he touches the intelligence only which has flowed and been derived from himself into these bodies.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And if thou also usest thyself to do this, thou wilt rid thyself of thy much trouble.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For he who regards not the poor flesh which envelops him, surely will not trouble himself by looking after raiment and dwelling and fame and such like externals and show.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "The things are three of which thou art composed, a little body, a little breath (life), intelligence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Of these the first two are thine, so far as it is thy duty to take care of them;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but the third alone is properly thine.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Therefore if thou shalt separate from thyself, that is, from thy understanding, whatever others do or say, and whatever thou hast done or said thyself, and whatever future things trouble thee because they may happen, and whatever in the body which envelops thee or in the breath (life), which is by nature associated with the body, is attached to thee independent of thy will, and whatever the external circumfluent vortex whirls round, so that the intellectual power exempt from the things of fate can live pure and free by itself, doing what is just and accepting what happens and saying the truth: if thou wilt separate, I say, from this ruling faculty the things which are attached to it by the impressions of sense, and the things of time to come and of time that is past, and wilt make thyself like Empedocles' sphere,   All round, and in its joyous rest reposing;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if thou shalt strive to live only what is really thy life, that is, the present- then thou wilt be able to pass that portion of life which remains for thee up to the time of thy death, free from perturbations, nobly, and obedient to thy own daemon (to the god that is within thee).",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "I have often wondered how it is that every man loves himself more than all the rest of men, but yet sets less value on his own opinion of himself than on the opinion of others.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If then a god or a wise teacher should present himself to a man and bid him to think of nothing and to design nothing which he would not express as soon as he conceived it, he could not endure it even for a single day.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "So much more respect have we to what our neighbours shall think of us than to what we shall think of ourselves.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How can it be that the gods after having arranged all things well and benevolently for mankind, have overlooked this alone, that some men and very good men, and men who, as we may say, have had most communion with the divinity, and through pious acts and religious observances have been most intimate with the divinity, when they have once died should never exist again, but should be completely extinguished?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if this is so, be assured that if it ought to have been otherwise, the gods would have done it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For if it were just, it would also be possible;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and if it were according to nature, nature would have had it so.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But because it is not so, if in fact it is not so, be thou convinced that it ought not to have been so:- for thou seest even of thyself that in this inquiry thou art disputing with the diety;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and we should not thus dispute with the gods, unless they were most excellent and most just;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "- but if this is so, they would not have allowed anything in the ordering of the universe to be neglected unjustly and irrationally.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Practise thyself even in the things which thou despairest of accomplishing.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For even the left hand, which is ineffectual for all other things for want of practice, holds the bridle more vigorously than the right hand;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for it has been practised in this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider in what condition both in body and soul a man should be when he is overtaken by death;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and consider the shortness of life, the boundless abyss of time past and future, the feebleness of all matter.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Contemplate the formative principles (forms) of things bare of their coverings;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "the purposes of actions;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "consider what pain is, what pleasure is, and death, and fame;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "who is to himself the cause of his uneasiness;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "how no man is hindered by another;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "that everything is opinion.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the application of thy principles thou must be like the pancratiast, not like the gladiator;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for the gladiator lets fall the sword which he uses and is killed;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but the other always has his hand, and needs to do nothing else than use it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "See what things are in themselves, dividing them into matter, form and purpose.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What a power man has to do nothing except what God will approve, and to accept all that God may give him.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "With respect to that which happens conformably to nature, we ought to blame neither gods, for they do nothing wrong either voluntarily or involuntarily, nor men, for they do nothing wrong except involuntarily.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consequently we should blame nobody.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "How ridiculous and what a stranger he is who is surprised at anything which happens in life.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Either there is a fatal necessity and invincible order, or a kind Providence, or a confusion without a purpose and without a director (Book IV).",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If then there is an invincible necessity, why dost thou resist?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if there is a Providence which allows itself to be propitiated, make thyself worthy of the help of the divinity.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But if there is a confusion without governor, be content that in such a tempest thou hast in thyself a certain ruling intelligence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And even if the tempest carry thee away, let it carry away the poor flesh, the poor breath, everything else;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "for the intelligence at least it will not carry away.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Does the light of the lamp shine without losing its splendour until it is extinguished;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and shall the truth which is in thee and justice and temperance be extinguished before thy death?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When a man has presented the appearance of having done wrong, say, How then do I know if this is a wrongful act?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And even if he has done wrong, how do I know that he has not condemned himself?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and so this is like tearing his own face.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider that he, who would not have the bad man do wrong, is like the man who would not have the fig-tree to bear juice in the figs and infants to cry and the horse to neigh, and whatever else must of necessity be.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For what must a man do who has such a character?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If then thou art irritable, cure this man's disposition.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "If it is not right, do not do it: if it is not true, do not say it.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For let thy efforts be-   In everything always observe what the thing is which produces for thee an appearance, and resolve it by dividing it into the formal, the material, the purpose, and the time within which it must end.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Perceive at last that thou hast in thee something better and more divine than the things which cause the various affects, and as it were pull thee by the strings.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "What is there now in my mind?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Is it fear, or suspicion, or desire, or anything of the kind?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "First, do nothing inconsiderately, nor without a purpose.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Second, make thy acts refer to nothing else than to a social end.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider that before long thou wilt be nobody and nowhere, nor will any of the things exist which thou now seest, nor any of those who are now living.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For all things are formed by nature to change and be turned and to perish in order that other things in continuous succession may exist.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Consider that everything is opinion, and opinion is in thy power.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Take away then, when thou choosest, thy opinion, and like a mariner, who has doubled the promontory, thou wilt find calm, everything stable, and a waveless bay.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Any one activity whatever it may be, when it has ceased at its proper time, suffers no evil because it has ceased;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor he who has done this act, does he suffer any evil for this reason that the act has ceased.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In like manner then the whole which consists of all the acts, which is our life, if it cease at its proper time, suffers no evil for this reason that it has ceased;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "nor he who has terminated this series at the proper time, has he been ill dealt with.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "But the proper time and the limit nature fixes, sometimes as in old age the peculiar nature of man, but always the universal nature, by the change of whose parts the whole universe continues ever young and perfect.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And everything which is useful to the universal is always good and in season.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Therefore the termination of life for every man is no evil, because neither is it shameful, since it is both independent of the will and not opposed to the general interest, but it is good, since it is seasonable and profitable to and congruent with the universal.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "For thus too he is moved by the deity who is moved in the same manner with the deity and moved towards the same things in his mind.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "These three principles thou must have in readiness.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "In the things which thou doest do nothing either inconsiderately or otherwise than as justice herself would act;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "but with respect to what may happen to thee from without, consider that it happens either by chance or according to Providence, and thou must neither blame chance nor accuse Providence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Second, consider what every being is from the seed to the time of its receiving a soul, and from the reception of a soul to the giving back of the same, and of what things every being is compounded and into what things it is resolved.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Third, if thou shouldst suddenly be raised up above the earth, and shouldst look down on human things, and observe the variety of them how great it is, and at the same time also shouldst see at a glance how great is the number of beings who dwell around in the air and the aether, consider that as often as thou shouldst be raised up, thou wouldst see the same things, sameness of form and shortness of duration.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Are these things to be proud of?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Cast away opinion: thou art saved.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Who then hinders thee from casting it away?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "When thou art troubled about anything, thou hast forgotten this, that all things happen according to the universal nature;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and forgotten this, that a man's wrongful act is nothing to thee;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and further thou hast forgotten this, that everything which happens, always happened so and will happen so, and now happens so everywhere;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "forgotten this too, how close is the kinship between a man and the whole human race, for it is a community, not of a little blood or seed, but of intelligence.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And thou hast forgotten this too, that every man's intelligence is a god, and is an efflux of the deity;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and forgotten this, that nothing is a man's own, but that his child and his body and his very soul came from the deity;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "forgotten this, that everything is opinion;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and lastly thou hast forgotten that every man lives the present time only, and loses only this.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Constantly bring to thy recollection those who have complained greatly about anything, those who have been most conspicuous by the greatest fame or misfortunes or enmities or fortunes of any kind: then think where are they all now?",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "Smoke and ash and a tale, or not even a tale.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "And let there be present to thy mind also everything of this sort, how Fabius Catullinus lived in the country, and Lucius Lupus in his gardens, and Stertinius at Baiae, and Tiberius at Capreae and Velius Rufus (or Rufus at Velia);",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and in fine think of the eager pursuit of anything conjoined with pride;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how worthless everything is after which men violently strain;",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    },
    {
      "text": "and how much more philosophical it is for a man in the opportunities presented to him to show.",
      "time": "",
      "speaker": {
        "name": "Marcus",
        "color": "#369ACC"
      },
      "ID": 0
    }
  ],
  "copiedCell": null,
  "prevfocus": 0,
  "newfocus": 0
}
`
}