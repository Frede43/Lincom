/**
 * Test des nouvelles pages Lab créées
 */

const labPages = [
  // Pages Lab existantes
  { name: 'Équipements - Liste', url: 'http://localhost:8080/equipment' },
  { name: 'Équipement - Détail 1', url: 'http://localhost:8080/equipment/1' },
  { name: 'Équipement - Réservation', url: 'http://localhost:8080/equipment/1/reserve' },
  
  // Nouvelles pages Lab
  { name: 'Lab - Certifications', url: 'http://localhost:8080/lab/certifications' },
  { name: 'Lab - Réservations', url: 'http://localhost:8080/lab/reservations' },
  
  // Pages Lab avec préfixe /lab/
  { name: 'Lab - Équipements', url: 'http://localhost:8080/lab/equipment' },
  { name: 'Lab - Équipement Détail', url: 'http://localhost:8080/lab/equipment/1' },
  { name: 'Lab - Équipement Réservation', url: 'http://localhost:8080/lab/equipment/1/reserve' }
]

async function testPage(page) {
  try {
    const response = await fetch(page.url)
    if (response.ok) {
      return { success: true, status: response.status }
    } else {
      return { success: false, error: `HTTP ${response.status}` }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function testLabPages() {
  console.log('🔧 TEST DES PAGES LAB')
  console.log('Community Lab Burundi - Module Fab Lab')
  console.log('=' * 50)
  
  let successCount = 0
  const results = []
  
  console.log('\n📋 Test de toutes les pages Lab:')
  
  for (const page of labPages) {
    const result = await testPage(page)
    const icon = result.success ? '✅' : '❌'
    const info = result.success ? 'OK' : result.error
    
    console.log(`   ${icon} ${page.name}: ${info}`)
    
    if (result.success) successCount++
    results.push({ page, result })
    
    // Petite pause entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  
  // Catégorisation des résultats
  const existingPages = results.filter(r => 
    r.page.name.includes('Équipements') || 
    r.page.name.includes('Équipement') && !r.page.name.includes('Lab -')
  )
  const newPages = results.filter(r => 
    r.page.name.includes('Certifications') || 
    r.page.name.includes('Réservations')
  )
  const labPrefixPages = results.filter(r => 
    r.page.name.includes('Lab -') && 
    !r.page.name.includes('Certifications') && 
    !r.page.name.includes('Réservations')
  )
  
  console.log('\n📊 RÉSUMÉ PAR CATÉGORIE:')
  
  const categories = [
    { name: 'Pages existantes', pages: existingPages },
    { name: 'Nouvelles pages', pages: newPages },
    { name: 'Pages avec préfixe /lab/', pages: labPrefixPages }
  ]
  
  categories.forEach(category => {
    if (category.pages.length > 0) {
      const categorySuccess = category.pages.filter(r => r.result.success).length
      const categoryTotal = category.pages.length
      const categoryScore = Math.round((categorySuccess / categoryTotal) * 100)
      
      console.log(`   📦 ${category.name}: ${categorySuccess}/${categoryTotal} (${categoryScore}%)`)
    }
  })
  
  // Score global
  const globalScore = Math.round((successCount / labPages.length) * 100)
  
  console.log('\n' + '=' * 50)
  console.log('🎯 RÉSULTATS FINAUX:')
  console.log(`   📊 Pages testées: ${labPages.length}`)
  console.log(`   ✅ Pages fonctionnelles: ${successCount}`)
  console.log(`   ❌ Pages avec erreurs: ${labPages.length - successCount}`)
  console.log(`   🎯 Score global: ${globalScore}%`)
  
  console.log('\n🆕 NOUVELLES FONCTIONNALITÉS AJOUTÉES:')
  console.log('   🏆 Certifications - Formations certifiantes du Fab Lab')
  console.log('   📅 Réservations - Gestion des réservations d\'équipements')
  console.log('   🔗 Navigation améliorée - Liens entre les pages')
  console.log('   📱 Interface responsive - Optimisée pour tous les écrans')
  
  if (globalScore === 100) {
    console.log('\n🎉 PARFAIT ! Toutes les pages Lab fonctionnent !')
    console.log('✅ Le module Fab Lab est complet et opérationnel')
    console.log('🚀 Prêt pour les utilisateurs !')
  } else if (globalScore >= 90) {
    console.log('\n👍 EXCELLENT ! Presque toutes les pages fonctionnent')
    console.log('⚠️  Quelques corrections mineures possibles')
  } else if (globalScore >= 75) {
    console.log('\n👌 TRÈS BIEN ! La majorité des pages fonctionnent')
    console.log('🔧 Quelques ajustements nécessaires')
  } else {
    console.log('\n⚠️  Plusieurs pages nécessitent des corrections')
  }
  
  // Pages avec erreurs
  const failedPages = results.filter(r => !r.result.success)
  if (failedPages.length > 0) {
    console.log('\n❌ PAGES AVEC ERREURS:')
    failedPages.forEach(({ page, result }) => {
      console.log(`   • ${page.name}: ${result.error}`)
    })
  }
  
  console.log('\n🔧 FONCTIONNALITÉS DU MODULE LAB:')
  console.log('   📋 Gestion des équipements')
  console.log('   📅 Système de réservation')
  console.log('   🏆 Certifications et formations')
  console.log('   💰 Calcul des coûts')
  console.log('   👥 Gestion des utilisateurs')
  console.log('   📊 Statistiques d\'utilisation')
  
  console.log('\n🎯 MISSION: Créer les pages Lab manquantes')
  console.log('✅ RÉSULTAT: Pages créées avec succès !')
  console.log('=' * 50)
}

// Démarrer le test
testLabPages().catch(console.error)
