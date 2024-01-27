package com.polimi.PPP.CodeKataBattle.Repositories;

import com.polimi.PPP.CodeKataBattle.Model.BattleSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BattleSubscriptionRepository extends JpaRepository<BattleSubscription, Long> {
    boolean existsByBattleIdAndUserId(Long battleId, Long userId);
}