import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "./FileSelector.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { Cell, Speaker, Action, ProtoCell } from "../hooks/types";

type FileSelector = {
  setFileName: (name: string) => void;
  dispatch: React.Dispatch<Action>;
  speakers: Speaker[];
};

function FileSelector({ setFileName, dispatch }: FileSelector) {
  function loadFile(acceptedFiles: File[]): void {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        setFileName(file.name);
        file.text().then((t) => {
          const { new_contents, speakers } = parse_vtt(t);
          dispatch({
            type: "setState",
            payload: {
              contents: new_contents,
              speakers: speakers,
            },
          });
        });
      };
      reader.readAsArrayBuffer(file);
      return;
    });
  }
  const onDrop = useCallback(loadFile, [setFileName, dispatch]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/vtt": [".vtt"] },
  });

  function loadDemo() {
    setFileName("demo.vtt");
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

function parse_vtt(raw_text: string) {
  const proto_contents = parse_vtt_cells(raw_text);
  const complete_contents = complete_sentences(proto_contents);
  const { speakers, new_contents } = add_proper_speakers(complete_contents);
  return { speakers, new_contents };
}

function time_from_vtt(line_with_time: string) {
  // capture and assign starting substring with any combination of numbers, colons and periods before space, no matter how long
  const time_to_parse = line_with_time.match(/^([\d:.]+)/)?.[1];
  if (!time_to_parse) {
    return "";
  }
  let totalSeconds;
  let hours;
  // if it contains a period
  if (!time_to_parse.includes(".")) {
    const timeParts = time_to_parse.split(/[:,.]/).map(Number);

    hours = timeParts[0]
    const minutes = timeParts[1]
    const seconds = timeParts[2]

    totalSeconds = hours * 3600 + minutes * 60 + seconds;
  } else {
    const timeParts = time_to_parse.split(/[:,.]/).map(Number);

    hours = timeParts.length === 4 ? timeParts[0] : 0;
    const minutes = timeParts.length === 4 ? timeParts[1] : timeParts[0];
    const seconds = timeParts.length === 4 ? timeParts[2] : timeParts[1];
    const milliseconds = timeParts.length === 4 ? parseInt(timeParts[3].toString().padEnd(3, '0')) : parseInt(timeParts[2].toString().padEnd(3, '0'));
    totalSeconds = hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  }

  // Format the time as hh:mm:ss.s or mm:ss.s if hours is 0
  const formattedTime = new Date(totalSeconds * 1000).toISOString().substr(hours === 0 ? 14 : 11, hours === 0 ? 8 : 12);

  return formattedTime;
}

function parseSpeaker(line: string) {
  const regex = /^([^:]+): (.*)$/;
  const match = line.match(regex);
  // If the line matches the pattern, return the speaker name and the rest of the string
  if (match) {
    const speaker_name = match[1];
    const message = match[2];
    return { speaker_name, message };
  } else {
    const speaker_name = "";
    const message = line;
    return { speaker_name, message };
  }
}

function parse_vtt_cells(raw_text: string): ProtoCell[] {
  const lines = raw_text.split(/\r?\n|\r|\n/g); // Split by newline
  const contents: ProtoCell[] = [];
  let current_cell: ProtoCell = {
    text: "",
    time: "",
    speaker_name: "",
  };

  lines.slice(2).forEach((line) => {
    if (/^\d{2}:\d{2}/.test(line)) { // If line starts with dd:dd, timestamp
      if (current_cell.text !== "") {
        contents.push(current_cell);
      }
      current_cell = {
        text: "",
        time: time_from_vtt(line),
        speaker_name: "",
      };
    }
    else if (/^[^:]+:/.test(line)) { // If line starts with chars then colon, speaker
      let { speaker_name, message } = parseSpeaker(line)
      if (message == "[Automatisk tekstet av Autotekst med OpenAI Whisper V3. Kan inneholde feil.]") {
        message = "";
      }
      if (message == "[Automatic captions by Autotekst using OpenAI Whisper V3. May contain recognition errors.]") {
        message = "";
      }
      current_cell.speaker_name = speaker_name;
      current_cell.text += message;
    }
    else { // Adding to the text of the current cell
      current_cell.text += line;
    }
  })
  contents.push(current_cell);
  return contents
}

function add_proper_speakers(contents: ProtoCell[]) {
  const speaker_names = Array.from(new Set(contents.map((cell) => cell.speaker_name)))
  const speakers = speaker_names.map((name: string, index: number) => {
    const colors = ["#369ACC", "#A83548", "#FFC615", "#12715D", "#A83548", "#FF5733", "#33FF57", "#3357FF", "#FF33A8"];
    // change this EXACT type of name "[SPEAKER_01]", with brackets, to this type of name "Speaker_1", if it contains SPEAKER_0
    name = name.replace(/\[SPEAKER_0(\d)\]/, "Speaker_$1");
    return { name: name, color: colors[index % colors.length] };
  })

  const new_contents = contents.map((cell) => {
    const ID = speaker_names.findIndex((speaker_name) => speaker_name === cell.speaker_name);
    return { 
      text: cell.text,
      time: cell.time,
      ID: ID,
      speaker: speakers[ID],
    }
  })
  return { speakers, new_contents }
}
  

function complete_sentences(contents: ProtoCell[]) {
  const new_contents: ProtoCell[] = [];
  let sentence_completed = true;

  for (let i = 0; i < contents.length; i++) {
    const new_sentences = contents[i].text
      .replace(/((?<!\bMr|\bMs|\bMrs)[.?!])\s*(?=[A-Z])/g, "$1|")
      .split("|");
    if (!sentence_completed) {
      new_contents[new_contents.length - 1].text += " " + new_sentences.shift()?.trim();
    }
    if (new_sentences.length !== 0) {
      new_contents.push({
        text: new_sentences.shift()?.trim() || "",
        time: contents[i].time,
        speaker_name: contents[i].speaker_name,
      });
    }
    for (const sentence of new_sentences) {
      new_contents.push({
        text: sentence.trim(),
        time: "",
        speaker_name: contents[i].speaker_name,
      });
    }
    sentence_completed =
      null !== new_contents[new_contents.length - 1].text.match(/\.|\?|!/g); // If the last sentence contains punctuation, it is completed
  }

  return new_contents
}

export default FileSelector;

function star_wars() {
  return '{"speakers":[{"name":"Luke","color":"#369ACC"},{"name":"Obi-Wan","color":"#A83548"},{"name":"C-3PO","color":"#FFC615"},{"name":"R2-D2","color":"#12715D"}],"contents":[{"text":"No, my father didn\'t fight in the wars.","time":"00:04.2","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"He was a navigator on a spice freighter.","time":"00:05.6","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"That\'s what your uncle told you.","time":"00:07.6","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"He didn\'t hold with your father\'s ideals, thought he should have stayed here and not gotten involved.","time":"00:09.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"You fought in the Clone Wars?","time":"00:15.3","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"Yes.","time":"00:17.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"I was once a Jedi Knight, the same as your father.","time":"00:18.2","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"I wish I\'d known him.","time":"00:20.7","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"He was the best star pilot in the galaxy.","time":"00:25.6","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"And a cunning warrior.","time":"00:29.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"I understand you\'ve become quite a good pilot yourself.","time":"00:31.3","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"And he was a good friend.","time":"00:36.2","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Which reminds me, I have something here for you.","time":"00:39.2","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Your father wanted you to have this when you were old enough, but your uncle wouldn\'t allow it.","time":"00:45.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"He feared you might follow old Obi-Wan on some damn fool idealistic crusade like your father did.","time":"00:51.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Sir, if you\'ll not be needing me, I\'ll close down for a while.","time":"00:57.9","ID":2,"speaker":{"name":"C-3PO","color":"#FFC615"}},{"text":"Sure, go ahead.","time":"01:00.3","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"What is it?","time":"01:04.6","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"The father\'s light saber.","time":"01:06.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"This is the weapon of a Jedi Knight.","time":"01:08.8","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Not as clumsy or random as a blaster.","time":"01:11.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"An elegant weapon for a more civilized age.","time":"01:15.4","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"For over a thousand generations, the Jedi Knights were the guardians of peace and justice in the Old Republic.","time":"01:22.5","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Before the dark times.","time":"01:29.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Before the Empire.","time":"01:32.1","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"How did my father die?","time":"01:36.9","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"A young Jedi named Darth Vader, who was a pupil of mine until he turned to evil, helped the Empire hunt down and destroy the Jedi Knights.","time":"01:41.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"He betrayed and murdered your father.","time":"01:52.1","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Now the Jedi are all but extinct.","time":"01:56.4","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"Vader was seduced by the dark side of the Force.","time":"01:59.9","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"The Force?","time":"02:04.5","ID":0,"speaker":{"name":"Luke","color":"#369ACC"}},{"text":"The Force is what gives the Jedi his power.","time":"02:06.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"It\'s an energy field created by all living things.","time":"02:09.7","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"It surrounds us and penetrates us.","time":"02:12.4","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"It binds the galaxy together.","time":"02:15.0","ID":1,"speaker":{"name":"Obi-Wan","color":"#A83548"}},{"text":"*Beeps*","time":"","speaker":{"name":"R2-D2","color":"#12715D"},"ID":3}],"copiedCell":null,"prevfocus":27,"newfocus":0}'
}

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
    }
  ],
  "copiedCell": null,
  "prevfocus": 0,
  "newfocus": 0
}
`
}