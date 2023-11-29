
export class PlaySFX {
  static type = '[Game] Play SFX';
  constructor(public sfx: string) {}
}

export class NotifyError {
  static type = '[Game] Notify Error';
  constructor(public message: string) {}
}

export class NotifyWarning {
  static type = '[Game] Notify Warning';
  constructor(public message: string) {}
}

export class NotifyInfo {
  static type = '[Game] Notify Info';
  constructor(public message: string) {}
}

export class NotifySuccess {
  static type = '[Game] Notify Success';
  constructor(public message: string) {}
}

export class AnalyticsTrack {
  static type = '[Game] Analytics Track';
  constructor(public event: string, public value = 1) {}
}

export class UpdateFirebaseUID {
  static type = '[Game] Update Firebase UID';
  constructor(public uid: string) {}
}

export class UpdateFirebaseSavefile {
  static type = '[Game] Update Firebase Savefile';
  constructor() {}
}
