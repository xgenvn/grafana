import React, { FC } from 'react';
import { FolderPicker, Props as FolderPickerProps } from 'app/core/components/Select/FolderPicker';

export interface Folder {
  title: string;
  id: number;
}

export interface Props extends Omit<FolderPickerProps, 'initiailTitle' | 'initialFolderId'> {
  value?: Folder;
}

export const RuleFolderPicker: FC<Props> = ({ value, ...props }) => (
  <FolderPicker initialTitle={value?.title} initialFolderId={value?.id} {...props} />
);
