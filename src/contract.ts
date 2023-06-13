import { BigInt } from '@graphprotocol/graph-ts';

import {
  Approval as ApprovalEvent,
  MinterAdded as MinterAddedEvent,
  MinterRemoved as MinterRemovedEvent,
  NewOwnership as NewOwnershipEvent,
  NewPendingOwnership as NewPendingOwnershipEvent,
  Transfer as TransferEvent,
} from '../generated/Contract/Contract';
import {
  Approval,
  Balance,
  MinterAdded,
  MinterRemoved,
  NewOwnership,
  NewPendingOwnership,
  Transfer,
} from '../generated/schema';

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMinterAdded(event: MinterAddedEvent): void {
  let entity = new MinterAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMinterRemoved(event: MinterRemovedEvent): void {
  let entity = new MinterRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewOwnership(event: NewOwnershipEvent): void {
  let entity = new NewOwnership(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewPendingOwnership(
  event: NewPendingOwnershipEvent
): void {
  let entity = new NewPendingOwnership(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  let senderBalanceEntity = Balance.load(event.params.from);
  if (!senderBalanceEntity) {
    senderBalanceEntity = new Balance(event.params.from);
    senderBalanceEntity.value = new BigInt(0);
  }
  senderBalanceEntity.value.minus(event.params.value);

  senderBalanceEntity.save()

  let receiverBalanceEntity = Balance.load(event.params.to);
  if (!receiverBalanceEntity) {
    receiverBalanceEntity = new Balance(event.params.to);
    receiverBalanceEntity.value = new BigInt(0)
  }
  receiverBalanceEntity.value.plus(event.params.value);

  receiverBalanceEntity.save()
}
