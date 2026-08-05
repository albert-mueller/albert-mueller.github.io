/**
 * Lokale Übersetzungsfunktionstest
 * Testet die Kernfunktionalität von local-translate.js
 */

// Testet das lokale Übersetzungsmodul
function testLocalTranslate() {
    console.log('=== Beginn des lokalen Übersetzungstests ===');
    
    // Test 1: Überprüfen, ob das LocalTranslate-Objekt existiert
    console.log('Test 1: Überprüfen des LocalTranslate-Objekts');
    if (typeof LocalTranslate !== 'undefined') {
        console.log('✅ LocalTranslate-Objekt existiert');
        console.log('LocalTranslate-Typ:', typeof LocalTranslate);
        console.log('LocalTranslate.translate-Typ:', typeof LocalTranslate.translate);
    } else {
        console.error('❌ LocalTranslate-Objekt fehlt');
        return;
    }
    
    // Test 2: Einfacher Übersetzungstest
    console.log('\nTest 2: Einfacher Übersetzungstest');
    try {
        const result1 = LocalTranslate.translate('hallo', 'de', 'zh');
        console.log('hallo ->', result1);
        console.log('✅ Deutsch nach Chinesisch Übersetzung erfolgreich');
        
        const result2 = LocalTranslate.translate('你好', 'zh', 'de');
        console.log('你好 ->', result2);
        console.log('✅ Chinesisch nach Deutsch Übersetzung erfolgreich');
    } catch (error) {
        console.error('❌ Einfacher Übersetzungstest fehlgeschlagen:', error);
    }
    
    // Test 3: Komplexer Satz Übersetzung
    console.log('\nTest 3: Komplexer Satz Übersetzung');
    try {
        const result3 = LocalTranslate.translate('guten morgen welt', 'de', 'zh');
        console.log('guten morgen welt ->', result3);
        console.log('✅ Komplexer Satz Übersetzung erfolgreich');
    } catch (error) {
        console.error('❌ Komplexer Satz Übersetzungstest fehlgeschlagen:', error);
    }
    
    // Test 4: Randfalltest
    console.log('\nTest 4: Randfalltest');
    try {
        const result4 = LocalTranslate.translate('', 'de', 'zh');
        console.log('Leerer String ->', result4);
        console.log('✅ Leerer String Verarbeitung erfolgreich');
        
        const result5 = LocalTranslate.translate('hallo', 'de', 'de');
        console.log('Gleiche Sprache Übersetzung ->', result5);
        console.log('✅ Gleiche Sprache Verarbeitung erfolgreich');
    } catch (error) {
        console.error('❌ Randfalltest fehlgeschlagen:', error);
    }
    
    // Test 5: Leistungstest
    console.log('\nTest 5: Leistungstest');
    try {
        const start = performance.now();
        for (let i = 0; i < 100; i++) {
            LocalTranslate.translate('hallo welt', 'de', 'zh');
        }
        const end = performance.now();
        console.log('100 Übersetzungen Dauer:', (end - start).toFixed(2), 'ms');
        console.log('✅ Leistungstest bestanden');
    } catch (error) {
        console.error('❌ Leistungstest fehlgeschlagen:', error);
    }
    
    console.log('\n=== Lokaler Übersetzungstest abgeschlossen ===');
}

// Wenn LocalTranslate verfügbar ist, automatischer Testlauf
if (typeof LocalTranslate !== 'undefined') {
    // Verzögere 1 Sekunde vor dem Test, um sicherzustellen, dass die Seite vollständig geladen ist
    setTimeout(testLocalTranslate, 1000);
} else {
    console.warn('LocalTranslate ist nicht definiert, Test kann nicht ausgeführt werden');
}
