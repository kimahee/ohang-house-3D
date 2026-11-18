/* 좌표 단위 1000 × 750. 이동 가능 지형을 10 단위 격자로 기록한다. */
window.Islands = {
  maps: {
    wood: {
      name: "목의 섬",
      han: "木",
      color: "#64764a",
      pale: "#e8ebd9",
      mood: "올리브빛 들판",
      spot: "풀빛 쉼터",
      rest: "클로버 벤치",
      desc: "낮은 언덕 사이로 난 길을 따라 걸어요. 풀빛 쉼터에는 나란히 앉을 자리가 있어요.",
      spawn: [414, 437],
      main: [518, 370],
      quiet: [737, 311],
      pin: [49, 82],
      card: [50, 60],
      mask: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAP4AAAAAAAf4AAAAAH/4AAAAAAL/8AAAAD//wAAAAAB//8AAABf//gAAAAAP//4AAAH///gAAAAB///wAAA////AAAAAf///oAAD///+AAAAD////wAD////8AAAAP///////////4AAAB////////////wAAB/////////////gAAP/////////////gAB//////////////AAf/////////////+gB//////////////+AP//////////////+A///////////////4H///////////////wf///////////////B///////////////8P///////////////w///////////////+D///////////////4P///////////////gf//////////////+D///////////////wD///////////////AH//////////////8AP//////////////gA//////////////4AB//////////////AAB/////////////4AAD/////////////AAAP////////////8AAA/////////////wAAD////////////+AAAH////////////oAAAP///////////+AAAAf///////////AAAAAf/////////+AAAAAA//////////wAAAAAA/////////+AAAAAAD/////////4AAAAAAD////////+AAAAAAAD////////wAAAAAAAD///////+AAAAAAAAD//59//+gAAAAAAAAD/MAB//wAAAAAAAAABwAAA/kAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
      seats: [
        [504, 370],
        [532, 370],
        [723, 311],
        [751, 311]
      ]
    },
    fire: {
      name: "화의 섬",
      han: "火",
      color: "#ac563c",
      pale: "#f3e3d7",
      mood: "테라코타 언덕",
      spot: "노을 광장",
      rest: "노을 벤치",
      desc: "붉은 능선 아래 너른 광장에 모여요. 먼저 손을 흔들면 노을빛 들판에 대화가 피어나요.",
      spawn: [419, 509],
      main: [504, 436],
      quiet: [661, 361],
      pin: [16, 48],
      card: [50, 53],
      mask: "AAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAf//AAAAAAAAAAAAAD//+AAAAAAAAAAAAAP//+ADwAAAAAAAAAB///+B/4AAAAAAAAAP//////wAAAAAAAAB///////gAAAAAAAAP//////+AAAAAAAAB////////QAAAAAAAP////////AAAAAAAA////////+AAAAAAAH////////+AAAAAAAP////////8AAAAAAB/////////4AAAAAAH/////////wAAAAAA//////////gAAAAAD//////////AAAAAAf/////////8AAAAAD//////////4AAAAAf//////////gAAAAD//////////+AAAAAP//////////wAAAAB///////////gAAAAD//////////+AAAAAf//4P//////4AAAAB//4Af//////AAAAAH/+AA//////8AAAAAf/gAB//////AAAAAB/4AAD/////wAAAAAP/AAA/////+AAAAAB/wAAP/////wAAAAAH+AAD//////AAAAAA/gAB//////4AAAAAD8AAf//////AAAAAAfAAP//////4AAAAAB8AD///////wAAAAAHgA///////+AAAAAAeAP///////4AAAAABwB////////AAAAAADAP///////8AAAAAAMB////////4AAAAAAAP////////wAAAAAAB/////////AAAAAAEP////////+AAAAAAZ/////////8AAAAAB//////////wAAAAAH//////////AAAAAA//////////8AAAAAB//////////gAAAAAH/////////8AAAAAAf/////////4AAAAAA//////////AAAAAAD/////////4AAAAAAH/////////gAAAAAAP////////+AAAAAAAB////////gAAAAAAAH////////AAAAAAAAf///////wAAAAAAAA////////AAAAAAAAB///////wAAAAAAAAH//////8AAAAAAAAAD//////wAAAAAAAAAD/////+AAAAAAAAAAAf////gAAAAAAAAAAAf///8AAAAAAAAAAAA////wAAAAAAAAAAAB///wAAAAAAAAAAAAA//gAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
      seats: [
        [490, 436],
        [518, 436],
        [647, 361],
        [675, 361]
      ]
    },
    earth: {
      name: "토의 섬",
      han: "土",
      color: "#997122",
      pale: "#f2e8cd",
      mood: "황금빛 평야",
      spot: "바람 평상",
      rest: "들녘 벤치",
      desc: "햇살 머금은 평야를 가로질러 바람 평상에 닿아요. 옆자리에 앉아 천천히 이야기를 나눠요.",
      spawn: [421, 486],
      main: [522, 414],
      quiet: [728, 320],
      pin: [49, 49],
      card: [55, 55],
      mask: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAegAAAAAAAAAAAAAAP/wAAAAAAAAAAAAAF//6AAAAAAAAAAAAA///8AAAAAAAAAAAAH///6AAAAAAAAAAAA////4AAAAAAAAAAAH////3/AAAAAAAAAA///////AAAAAAAAAH///////AAAAAAAAB///////+AAAAAAAAf/////////4AAAAAH//////////8AAAAAf//////////8AAAAD///////////4AAAAf///////////wAAAB////////////AAAAP////////////AAAAf///////////8AAAD////////////4AAAP////////////wAAA/////////////AAAP////////////8AAA/////////////wAAH/////////////gAD//////////////AAf/////////////+AB//////////////8AP//////////////4A///////////////AD//////////////+Af//////////////4B///////////////AH//////////////8Af//////////////4A///////////////AB//////////////8AP//////////////AAf/////////////8AA//////////////wAB/////////////+AAH/////////////4AAf/////////////wAA//////////////AAD/////////////8AAf/////////////wAA/////////////+AAD/////////////4AAf/////////////AAB/////////////wAAD////////////+AAAH////////////wAAAP///////////8AAAA///////////8AAAAB///////////AAAAAA//////////oAAAAAC/////////+AAAAAAAA////////wAAAAAAAB///////+AAAAAAAAP//////lAAAAAAAAAf/////8AAAAAAAAAAP/////AAAAAAAAAAAHn///4AAAAAAAAAAAAP//9AAAAAAAAAAAAAH//gAAAAAAAAAAAAAf/+AAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
      seats: [
        [508, 414],
        [536, 414],
        [714, 320],
        [742, 320]
      ]
    },
    metal: {
      name: "금의 섬",
      han: "金",
      color: "#616b78",
      pale: "#e5e7eb",
      mood: "은회색 봉우리",
      spot: "은빛 전망대",
      rest: "돌빛 쉼터",
      desc: "세 봉우리 아래 은빛 바위길이 이어져요. 전망대에서 함께 선 모습을 사진으로 간직해요.",
      spawn: [402, 451],
      main: [510, 384],
      quiet: [770, 413],
      pin: [49, 18],
      card: [54, 34],
      mask: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAP4AAAAAAAAAAAAAAAfwAAAAAAAAAAAIAAB/wAAAAAAAAAAfwAAD/wAAAAAAAAAH+AAAH//wAAAAAAAA/wAAAP//gAAAAAAAH+AAAB//+AAAAAAAA/wAAA///4AAAAAAAf/AAA////4AAAAAAP//gAP//5/wAAAAAff//+D//+B/gAAAAH4f//////wH/AAAAA+Af//////AP/AAAAHwA//////4Af4AAAAeAB//////AB/wAAADwAD/////4AD/gAAAOAAH/////AAD/gAAF4AAP////4AgH/AABfAAA/////4f//+AAP8A/f/////////4AA/+P///////////wAH//////////////AA//////////////+AH//////////////wAP//////////////gB//////////////+AP//////////////8B///////////////4H///////////////gf///////////////D///////////////4P///////////////gf//////////////+B///////////////wB//////////////+AAf/////////////wAAf/////////////AAAf////////////4AAA/////////////AAAD///////////g4AAAP//////////wAAAAAf/////////wAAAAAAf////////gAAAAAAAH///////8AAAAAAAAH///////gAAAAAAAAf//////8AAAAAAAAAf//////gAAAAAAAAA/5////8AAAAAAAAAAAA////gAAAAAAAAAAAA///wAAAAAAAAAAAAB//+AAAAAAAAAAAAAAAfwAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
      seats: [
        [496, 384],
        [524, 384],
        [756, 413],
        [784, 413]
      ]
    },
    water: {
      name: "수의 섬",
      han: "水",
      color: "#397876",
      pale: "#daebe6",
      mood: "청록빛 물길",
      spot: "물결 나루",
      rest: "건너편 쉼터",
      desc: "굽이치는 물길을 따라 나루로 걸어요. 작은 나무다리를 건너면 조용한 물가 쉼터가 보여요.",
      spawn: [370, 445],
      main: [465, 371],
      quiet: [817, 374],
      pin: [84, 48],
      card: [57, 52],
      bridge: [706, 365, 110],
      mask: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAf/gAAAAAAAAAAAAAH//wAAAAAAAAAAAA////gAAAAAAAAAAAP////AAAAAAAAAAAD////+AAAAAAAAAAD/////8AAAAAAAAAA//////4AAAAAAAAAH/////wAAAAAAAAAA/////8AAAAAAAAAAH/////gAAAAAAAAAB/////+PwAAAAAAAD//////x/gAAAAAAA//////4P+AAAAAAAH/////wB/8AAAAAAA/////4Af/8AAAAAAP////+Af//8AAAAAD/////wP///wAAAAAP////+D////gAAAAB/////wf///+AAAAAH/////B////8AAAAA/////8D////wAAAAH/////4P////gAAAAf/////gH///+AAAAB//////gD///4AAAAP//////AB///gAAAA///////AA//+AAAAB///////wA//wAAAAH///////4B//AAAAAf///////4D/4AAAAAf///////4H/wAAAAA////////wP/AAAAAD//////////8AAAAAP//////////4AAAAAf//////////gAAAAB////////B/+AAAAAH///////4H/8AAAAAf//////+A//gAAAAB///////AP/+AAAAAP//////AB//wAAAAA//////gA///AAAAAH/////4Af//4AAAAA/////+AP///AAAAAD/////wH///8AAAAAP////+A////wAAAAB/////wH////AAAAAH////+A////8AAAAAf////wD////4AAAAA/////APwCf/gAAAAD////8A+AAP+AAAAAH////4BAAAP4AAAAAP////gAAAAfAAAAAAf////AAAAA8AAAAAAf///+AAAABgAAAAAA////8AAAAAAAAAAAB////gAAAAAAAAAAAH///4AAAAAAAAAAAAP///AAAAAAAAAAAAAf//8AAAAAAAAAAAAAf//wAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAP4AAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
      seats: [
        [451, 371],
        [479, 371],
        [803, 374],
        [831, 374]
      ]
    }
  }
};
window.Islands.mapImage = (id) => "./assets/maps/" + id + ".webp";
