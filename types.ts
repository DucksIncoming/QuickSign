export type Methods = "GET" | "POST" | "DELETE" | "PATCH";

export type PromiseResult<T> = Promise<IResult<T>>;

export type RegisterResult = PromiseResult<IRegisterResult>;
export type LoginResult = PromiseResult<ILoginResult>;
export type DeleteResult = Promise<IDelete>;
export type AccountResult = PromiseResult<IAccountResult>;
export type DomainListResult = PromiseResult<IDomainResult[]>;
export type DomainResult = PromiseResult<IDomainResult>;
export type MessageListResult = PromiseResult<IMessagesResult[]>;
export type MessageResult = PromiseResult<IMessageResult>;
export type MessageSeenResult = PromiseResult<IMessageSeen>;
export type SourceResult = PromiseResult<ISourceResource>;

/** register() */
interface IRegisterResult {
  id: string;
  address: string;
  quota: number;
  used: number;
  isDisable: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/** login() */
interface ILoginResult {
  token: string;
  id: string;
}

/** deleteAccount() - deleteMe() - deleteMessage() */
interface IDelete {}

/** me() - getAccount() */
interface IAccountResult extends IRegisterResult {}

/** getDomain() - getDomains() */
interface IDomainResult {
  id: string;
  domain: string;
  isActive: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

/** getMessages() */
interface IMessagesResult {
  id: string;
  accountId: string;
  msgid: string;
  from: {
    address: string;
    name: string;
  };
  to: {
    address: string;
    name: string;
  };
  subject: string;
  intro: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
}

/** getMessage() */
interface IMessageResult extends IMessagesResult {
  cc: string[];
  bcc: string[];
  flagged: boolean;
  isDeleted: boolean;
  verifications: string[];
  retention: boolean;
  retentionDate: string;
  text: string;
  html: string[];
  attachments: Attachment[];
  size: number;
}

interface Attachment {
  id: string;
  filename: string;
  contentType: string;
  disposition: string;
  transferEncoding: string;
  related: boolean;
  size: number;
  downloadUrl: string;
}

/** setMessageSeen() */
interface IMessageSeen {
  seen: boolean;
}

/** getSource() */
interface ISourceResource {
  id: string;
  downloadUrl: string;
  data: string;
}

export type CreateOneAccountResult = Promise<
  | DomainResult
  | RegisterResult
  | LoginResult
  | {
      status: boolean;
      data: {
        username: string;
        password: string;
      };
    }
>;

/**
 * Request object
 */
export interface IRequestObject {
  method: Methods;
  headers: {
    accept: string;
    authorization: string;
    "content-type"?: string;
  };
  body?: string;
}

/**
 * Request response
 */
interface IResult<T> {
  status: boolean;
  message: string;
  data: T;
}