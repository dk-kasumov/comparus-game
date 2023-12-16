interface BaseDialogData {
  title: string;
}

export class DialogConfig<T = any> {
  data!: T & BaseDialogData;
}
