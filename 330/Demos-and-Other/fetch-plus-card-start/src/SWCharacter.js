export default class SWCharacter{
  constructor(name,hairColor,eyeColor){
    // this.name = name;
    // this.hairColor = hairColor;
    // this.eyeColor = eyeColor;
    Object.assign(this,{name,hairColor,eyeColor});
  }
}