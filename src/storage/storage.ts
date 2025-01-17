import { text, StableBTreeMap } from "azle/experimental";
import { Vendor, Wedding } from "../datatypes/dataTypes";



/**
 * Storage Setup
 */
const vendorStorage = StableBTreeMap<text, Vendor>(0);
const weddingStorage = StableBTreeMap<text, Wedding>(1);

export {
    vendorStorage,
    weddingStorage
}
