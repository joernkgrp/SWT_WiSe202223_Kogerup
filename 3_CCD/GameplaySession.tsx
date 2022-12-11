/**
 * Import components, game and accessibility elements
 */
import { ButtonID } from "../app/components/Buttons/Button.Model";
import { UIHelper } from "./UIHelper";
import { AudioPlayer, Sound } from "./AudioPlayer";
import { action, computed, makeObservable, observable } from "mobx";
import { wait } from "../utils/AsyncUtils";
import { Accessibility } from "../app/context/AccessibilityContext";
import { LevelScoreManager } from "./LevelScoreCalculator";

/**
 * Gameplay session
 */
export class GameplaySession {
  /**
   * Status if a random sequence is playing and presented to the user
   */
  @observable public isPlayingSequence: boolean = true;
  
  /**
   * Status if the initial countdown app is counting down or not
   */
  @observable public isCountingDown: boolean = true;
  
  /**
   * Status if the extreme mode is set or ot
   */
  @observable public isExtremeMode: boolean = false;
  
  /**
   * Current game level
   */
  @computed public get level(): number {
    return this._level;
  }
  
  /**
   * Status if the current level has been completed or not yet
   */
  @computed public get isGameOver(): boolean {
    return this.playerLife <= 0;
  }
  
  /**
   * Status if the current level has been completed or not yet
   */
  @computed public get isLevelCompleted(): boolean {
    return (
      this.isLevelStarted &&
      this._refButtonIndex === this._randomSequence.length
    );
  }
  
  /**
   * Total number of required attempts to solve the sequence quiz
   */
  @computed public get attempts(): number {
    return this._clickedSequence.length;
  }
  
  /**
   * Player's gained total score
   */
  @computed public get playerTotalScore(): number {
    return this._playerTotalScore;
  }
  
  /**
   * Player's remaining lives
   */
  @computed public get playerLife(): number {
    return this._playerLife;
  }
  
  /**
   * Player's number of tips during the game
   */
  @computed public get numberOfTips(): number {
    let maxTips = Accessibility.cognitive.numberOfTips;
    return maxTips - this.takenTips;
  }
 
  /**
   * Next tip to be displayed during the game
   */
  public nextTip(): string[] {
    if (
      this._randomSequence.length === 0 ||
      this._randomSequence.length === this._refButtonIndex
    ) {
      return [];
    }
    let nextButtonID = this._randomSequence[this._refButtonIndex];
    let buttonLocation = "";
   
    /**
     * Possible tips to be displayed, dependant on current sequence state
     */
    switch (nextButtonID) {
      case ButtonID.TopLeft:
        buttonLocation = "(oben links)";
        break;
      case ButtonID.TopRight:
        buttonLocation = "(oben rechts)";
        break;
      case ButtonID.BottomLeft:
        buttonLocation = "(unten links)";
        break;
      case ButtonID.BottomRight:
        buttonLocation = "(unten rechts)";
        break;
    }
    let button = document.getElementById(nextButtonID);
    return [`${button?.ariaLabel ?? ""}`, buttonLocation];
  }

  /**
   * Player's gained total score
   * @private
   */
  @observable private _playerTotalScore: number = 0;
  /**
   * Player's remaining lives
   * @private
   */

  @observable private _playerLife: number = 5;
 
  /**
   * Sum of already lost player lives
   * @private
   */
  @observable private lostPlayerLives: number = 0;
  
  /**
   * Lost player's lives during the current level
   * @private
   */
  private levelLostPlayerLives: number = 0;
  
  /**
   * Sum of already taken tips
   * @private
   */
  @observable private takenTips: number = 0;
  
  /**
   * Current level
   * Note: this property also declares the total number of random button picks
   * @private
   */
  @observable private _level: number = 0;
  
  /**
   * Current sequence of randomly picked buttons
   * @private
   */
  @observable private _randomSequence: ButtonID[] = [];
  
  /**
   * Current sequence of buttons selected by the user
   * @private
   */
  @observable private _clickedSequence: ButtonID[] = [];
 
  /**
   * Current validation index
   * @private
   */
  @observable private _refButtonIndex: number = 0;

  /**
   * Status whether the current level has been completed or not
   * @private
   */
  @observable public isLevelStarted: boolean = false;

  /**
   * Time needed to complete the current level
   */
  public get levelCompletionTime(): number {
    return this.scoreManager.timeNeeded;
  }

  /**
   * Reached score of the currently completed level
   */
  public get levelScore(): number {
    return this.scoreManager.calcScore(this._level, this.levelLostPlayerLives);
  }

  /**
   * Current level's score to reach all three stars
   */
  public get threeStarLevelScore(): number {
    return this.scoreManager.calcThreeStarScore(this.level);
  }

  /**
   * Session's game score manager
   * @private
   */
  private scoreManager: LevelScoreManager = new LevelScoreManager();
  
  /**
   * Create a new gameplay session
   * @private
   */
  constructor() {
    makeObservable(this);
  }
 
  /**
   * Start new round of the game
   */
  @action public async start(isReset: boolean = false) {
    /**
     * Initialization
     * */
    if (isReset) {
      this._playerLife = Accessibility.cognitive.playerLives;
      this._level = 0;
      this.takenTips = 0;
      this.lostPlayerLives = 0;
      this._playerTotalScore = 0;
    }
    
    /**
     * Check states for first round
     */
    if (this.isLevelStarted && !isReset) {
      this._playerTotalScore += this.levelScore;
    }
    this.levelLostPlayerLives = 0;
    this.isCountingDown = true;
    this.isLevelStarted = false;
    this._clickedSequence = [];
    if (this.isExtremeMode) {
      this.resetRandomSequence();
    }
    this.setIsPlayingSequence(true);
    this.setRefButtonIndex(0);
   
    /**
     * Integrate timer for accessibility features
     */
    await wait(250);
    await this.countDown(Accessibility.motor.levelCountdownDuration);
    
    /**
     * Start sequence, start level
     */
    this.incrementRound();
    this.generateNewSequence();
    this.presentRandomSequence().then(() => {
      this.setLevelStarted(true);
      this.setIsPlayingSequence(false);
      this.scoreManager.startTimer();
      /**
       * Enable subtitles
       * */
      const subtitleLabel = document.getElementById("subtitle");
      if (subtitleLabel) {
        subtitleLabel!.innerHTML = "";
      }
    });
  }
 
  /**
   * Replay the random sequence of the round
   */
  @action public async replaySequence() {
    if (!this.isLevelStarted) {
      return;
    }
    /**
     * Check timer status
     */
    this.scoreManager.pauseTimer();
    this.setIsPlayingSequence(true);
    setTimeout(() => {
      this.presentRandomSequence().then(() => {
        this.setIsPlayingSequence(false);
        this.scoreManager.resumeTimer();
      });
    }, 125);
  }
 
  /**
   * Generate a new sequence of random picks
   */
  private generateNewSequence() {
    this.setRefButtonIndex(0);

    if (this.isExtremeMode) {
      this.resetRandomSequence();
      for (let i = 0; i < this.level; i++) {
        this.addToRandomSequence(GameplaySession.getRandomButton());
      }
    } else {
      this.addToRandomSequence(GameplaySession.getRandomButton());
    }
  }
 
  /**
   * Present the random sequence to the user
   */
  private async presentRandomSequence() {
    for (const buttonID of this._randomSequence) {
      await UIHelper.highlightButton(buttonID);
    }
  }
  
  /**
   * Check if a clicked button matches the randomly picked one at given order
   * @param clickedButton The clicked button which to evaluate against the randomly picked one
   */
  public isCorrectSelection(clickedButton: ButtonID): boolean {
    if (this.isLevelCompleted) {
      return true;
    }
    /**
     * Check if given input is correct
     */
    this._clickedSequence.push(clickedButton);
    const refButton = this._randomSequence[this._refButtonIndex];
    const isCorrectSelection = refButton === clickedButton;
    UIHelper.showTapFeedback(isCorrectSelection); // Accessbility feature
    if (isCorrectSelection) {
      this.setRefButtonIndex(this._refButtonIndex + 1);
    } else {
      this.recalcPlayerLives();
    }
   
    /**
     * Play audio sounds
     */
    AudioPlayer.play(
      isCorrectSelection
        ? Sound.CorrectSelection
        : Sound.WrongSelection
    );
   
    /**
     * Check if kevel is completed
     */
    if (this.isLevelCompleted) {
      this.scoreManager.stopTimer();
      AudioPlayer.play(Sound.LevelCompleted);
    }
    return isCorrectSelection;
  }
  
  /**
   * Trigger a countdown starting from given counter
   * @param steps The steps from which the timer will be counted down
   */
  @action private async countDown(steps: number) {
    const countdownId = "countdown";
    this.isCountingDown = true;
    for (let counter = steps; counter > 0; counter--) {
      document.getElementById(countdownId)!.innerHTML = `${counter}`;
      AudioPlayer.play(Sound.Countdown);
      await wait(1200);
    }
    AudioPlayer.play(Sound.LevelStarted);
    document.getElementById(countdownId)!.innerHTML = "";
    await wait(1400);
    this.isCountingDown = false;
  }
 
  /**
   * Game actions
   */
  @action private setIsPlayingSequence(isPlaying: boolean) {
    this.isPlayingSequence = isPlaying;
  }
  @action private setLevelStarted(isStarted: boolean) {
    this.isLevelStarted = isStarted
  }
  @action private incrementRound() {
    this._level += 1; // Next level
  }
  @action private setRefButtonIndex(index: number) {
    this._refButtonIndex = index;
  }
  
  /**
   * User's lives
   */
  @action public updatePlayerLives(newPlayerLives: number) {
    let newLives = newPlayerLives - this.lostPlayerLives;
    this._playerLife = newLives >= 0 ? newLives : 0;
  }
  
  /**
   * Given tips in the game
   */
  @action public incrementTakenTips() {
    let maxNumberOfTips = Accessibility.cognitive.numberOfTips;
    if (maxNumberOfTips !== 0 && maxNumberOfTips !== 7) {
      this.takenTips++;
    }
  }
  
  /**
   * Reset random sequence
   */
  @action private resetRandomSequence() {
    this._randomSequence = [];
  }
  @action private addToRandomSequence(buttonID: ButtonID) {
    this._randomSequence.push(buttonID);
  }
  @action private decrementPlayerLife() {
    this._playerLife -= this._playerLife > 0 ? 1 : 0;
  }
  private recalcPlayerLives(wasWrongDecision: boolean = true) {
    if (wasWrongDecision && Accessibility.cognitive.playerLives !== 7) {
      this.decrementPlayerLife();
      this.lostPlayerLives++;
    }
    this.levelLostPlayerLives++;
  }
 
  /**
   * Generate a random button
   * @private
   */
  private static getRandomButton(): ButtonID {
    const random = Math.floor(
      Math.random() * Object.keys(ButtonID).length
    );
    return Object.values(ButtonID)[random] as ButtonID;
  }
}
