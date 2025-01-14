# Wedding Planner Canister

## Overview

This canister provides a comprehensive solution for managing wedding planning activities. It supports functionalities such as vendor management, wedding creation, guest management, task tracking, registry management, and more. Built with Azle, it leverages the Internet Computer's capabilities to provide secure and decentralized wedding planning services.

## Features

### Vendor Management

- **Register Vendor**: Vendors can register their services by providing details like name, category, service cost, availability, and portfolio.
- **Search Vendors**: Search for vendors based on category.
- **View All Vendors**: Retrieve a list of all registered vendors.

### Wedding Management

- **Create Wedding**: Create a wedding event by providing details such as couple names, date, budget, location, and guest count.
- **View Wedding Details**: Retrieve detailed information about a specific wedding.
- **View All Weddings**: Retrieve a list of all weddings.

### Guest Management

- **RSVP Submission**: Guests can RSVP to a wedding by providing their details.
- **RSVP Approval**: Wedding organizers can approve RSVPs and assign table seating.
- **View Guest List**: Retrieve the guest list for a wedding.
- **Get RSVP Status**: Check the RSVP status of a guest.
- **Get Guest Count**: Get the total number of guests for a wedding.

### Task Management

- **Add Task**: Create tasks for the wedding planning process.
- **Update Task Status**: Update the status of a task (e.g., pending, in-progress, completed).
- **Delete Task**: Remove a task from the wedding.
- **Get Task List**: Retrieve all tasks for a wedding.
- **Get Task Details**: Retrieve details of a specific task.

### Timeline Management

- **Add Timeline Item**: Add events to the wedding timeline.
- **View Wedding Timeline**: Retrieve the timeline for a specific wedding.

### Registry Management

- **Add Registry Item**: Add items to the wedding registry.
- **Update Registry Item Status**: Update the status of a registry item (e.g., purchased).
- **Delete Registry Item**: Remove items from the registry.
- **Get Registry Items**: Retrieve all registry items for a wedding.
- **Get Registry Item Details**: Retrieve details of a specific registry item.

## Data Structures

### Core Types

- **Vendor**: Details about a vendor, including name, category, service cost, availability, portfolio, and reviews.
- **Wedding**: Comprehensive details about a wedding, such as date, location, guest list, tasks, and registry.
- **Task**: Information about a wedding planning task, including title, description, deadline, and status.
- **Guest**: Details about a wedding guest, including RSVP status, dietary restrictions, and table assignment.
- **Registry Item**: Items in the wedding registry with their status and purchaser details.

### Payload Types

- **RegisterVendorPayload**: Data required to register a vendor.
- **CreateWeddingPayload**: Data required to create a wedding.
- **GuestRSVPPayload**: Data for guest RSVP submission.
- **AddTaskPayload**: Data required to add a task.
- **AddRegistryItemPayload**: Data required to add a registry item.

## Error Handling

The canister uses a `Message` variant to represent various error states:

- `VendorNotFound`
- `WeddingNotFound`
- `UnauthorizedAction`
- `DateUnavailable`
- `BudgetExceeded`
- `InvalidDate`

## Setup

- [Installation](#installation)
- [Deployment](#deployment)

Azle helps you to build secure decentralized/replicated servers in TypeScript or JavaScript on [ICP](https://internetcomputer.org/). The current replication factor is [13-40 times](https://dashboard.internetcomputer.org/subnets).

Please remember that Azle is in beta and thus it may have unknown security vulnerabilities due to the following:

- Azle is built with various software packages that have not yet reached maturity
- Azle does not yet have multiple independent security reviews/audits
- Azle does not yet have many live, successful, continuously operating applications deployed to ICP

## Installation

> Windows is only supported through a Linux virtual environment of some kind, such as [WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

You will need [Node.js 20](#nodejs-20) and [dfx](#dfx) to develop ICP applications with Azle:

### Node.js 20

It's recommended to use nvm to install Node.js 20:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Restart your terminal and then run:

```bash
nvm install 20
```

Check that the installation went smoothly by looking for clean output from the following command:

```bash
node --version
```

### dfx

Install the dfx command line tools for managing ICP applications:

```bash
DFX_VERSION=0.22.0 sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
```

Check that the installation went smoothly by looking for clean output from the following command:

```bash
dfx --version
```

## Deployment

Clone repository and enter the project directory:

```bash
cd decentralized-wedding-planning-platform
```

```bash
# install all npm dependencies including azle
npm install
```

```bash
# start up a local ICP replica in the background
dfx start --clean --background
```

In a separate terminal in the `decentralized-wedding-planning-platform` directory:

```bash
# deploy your canister
dfx deploy
```
