import * as assert from 'power-assert';
import { DummyRandomGenerator, IncrementRandomGenerator } from './TestRandomGenerator'
import MutableRandomGenerator from '../../../src/random/generator/MutableRandomGenerator';
import { char, ascii, unicode, hexa, base64 } from '../../../src/check/arbitrary/CharacterArbitrary';
import * as jsc from 'jsverify';

describe("CharacterArbitrary", () => {
    describe('char', () => {
        it('Should generate a single printable character', () => jsc.assert(
            jsc.forall(jsc.integer, (seed) => {
                const mrng = new MutableRandomGenerator(new DummyRandomGenerator(seed));
                const g = char().generate(mrng);
                return g.length === 1 && 0x20 <= g.charCodeAt(0) && g.charCodeAt(0) <= 0x7e;
            })
        ));
        it('Should be able to produce any printable character', () => jsc.assert(
            jsc.forall(jsc.integer, jsc.integer(32, 126), (seed, selected) => {
                const mrng = new MutableRandomGenerator(new IncrementRandomGenerator(seed));
                const arb = char();
                const waitingFor = String.fromCharCode(selected);
                for (let t = 0 ; t !== 96 ; ++t) { // check for equiprobable at the same time
                    if (arb.generate(mrng) === waitingFor) {
                        return true;
                    }
                }
                throw `Unable to produce '${waitingFor}' (${selected}) given seed ${seed}`;
            })
        ));
    });
    describe('ascii', () => {
        it('Should generate a single ascii character', () => jsc.assert(
            jsc.forall(jsc.integer, (seed) => {
                const mrng = new MutableRandomGenerator(new DummyRandomGenerator(seed));
                const g = ascii().generate(mrng);
                return g.length === 1 && 0x00 <= g.charCodeAt(0) && g.charCodeAt(0) <= 0x7f;
            })
        ));
        it('Should be able to produce any character from ascii', () => jsc.assert(
            jsc.forall(jsc.integer, jsc.integer(0, 127), (seed, selected) => {
                const mrng = new MutableRandomGenerator(new IncrementRandomGenerator(seed));
                const arb = ascii();
                const waitingFor = String.fromCharCode(selected);
                for (let t = 0 ; t !== 128 ; ++t) { // check for equiprobable at the same time
                    if (arb.generate(mrng) === waitingFor) {
                        return true;
                    }
                }
                throw `Unable to produce '${waitingFor}' (${selected}) given seed ${seed}`;
            })
        ));
    });
    describe('unicode', () => {
        it('Should generate a single unicode character', () => jsc.assert(
            jsc.forall(jsc.integer, (seed) => {
                const mrng = new MutableRandomGenerator(new DummyRandomGenerator(seed));
                const g = unicode().generate(mrng);
                return g.length === 1 && 0x0000 <= g.charCodeAt(0) && g.charCodeAt(0) <= 0xffff;
            })
        ));
        it('Should be able to produce any character from unicode', () => jsc.assert(
            jsc.forall(jsc.integer, jsc.integer(0, 65535), (seed, selected) => {
                const mrng = new MutableRandomGenerator(new IncrementRandomGenerator(seed));
                const arb = unicode();
                const waitingFor = String.fromCharCode(selected);
                for (let t = 0 ; t !== 65536 ; ++t) { // check for equiprobable at the same time
                    if (arb.generate(mrng) === waitingFor) {
                        return true;
                    }
                }
                throw `Unable to produce '${waitingFor}' (${selected}) given seed ${seed}`;
            })
        ));
    });
    describe('hexa', () => {
        it('Should generate a single hexa character', () => jsc.assert(
            jsc.forall(jsc.integer, (seed) => {
                const mrng = new MutableRandomGenerator(new DummyRandomGenerator(seed));
                const g = hexa().generate(mrng);
                return g.length === 1 && (('0' <= g && g <= '9') || ('a' <= g && g <= 'f'));
            })
        ));
        it('Should be able to produce any character from hexa', () => jsc.assert(
            jsc.forall(jsc.integer, jsc.integer(0, 15), (seed, selected) => {
                const mrng = new MutableRandomGenerator(new IncrementRandomGenerator(seed));
                const arb = hexa();
                const waitingFor = '0123456789abcdef'[selected];
                for (let t = 0 ; t !== 16 ; ++t) { // check for equiprobable at the same time
                    if (arb.generate(mrng) === waitingFor) {
                        return true;
                    }
                }
                throw `Unable to produce '${waitingFor}' (${selected}) given seed ${seed}`;
            })
        ));
    });
    describe('base64', () => {
        it('Should generate a single base64 character', () => jsc.assert(
            jsc.forall(jsc.integer, (seed) => {
                const mrng = new MutableRandomGenerator(new DummyRandomGenerator(seed));
                const g = base64().generate(mrng);
                return g.length === 1 && (
                    ('a' <= g && g <= 'z') ||
                    ('A' <= g && g <= 'Z') ||
                    ('0' <= g && g <= '9') ||
                    g === '+' || g === '/'
                );
            })
        ));
        it('Should be able to produce any character from base64', () => jsc.assert(
            jsc.forall(jsc.integer, jsc.integer(0, 63), (seed, selected) => {
                const mrng = new MutableRandomGenerator(new IncrementRandomGenerator(seed));
                const arb = base64();
                const waitingFor = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[selected];
                for (let t = 0 ; t !== 64 ; ++t) { // check for equiprobable at the same time
                    if (arb.generate(mrng) === waitingFor) {
                        return true;
                    }
                }
                throw `Unable to produce '${waitingFor}' (${selected}) given seed ${seed}`;
            })
        ));
    });
});